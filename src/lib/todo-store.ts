import { signInAnonymously } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import type { FocusTask } from "@/lib/focus-task";
import { auth, db } from "@/lib/firebase";

type EventType = "created" | "completed" | "reopened" | "deleted";

type TodoDoc = {
  title: string;
  minutes: number;
  done: boolean;
  isDeleted: boolean;
};

const getUserTodosCollection = (uid: string) => {
  if (!db) {
    throw new Error("Firestore is not configured");
  }
  return collection(db, "users", uid, "todos");
};

const getUserEventsCollection = (uid: string) => {
  if (!db) {
    throw new Error("Firestore is not configured");
  }
  return collection(db, "users", uid, "todoEvents");
};

const makeEventPayload = (
  uid: string,
  todoId: string,
  eventType: EventType,
  before: Record<string, unknown> | null,
  after: Record<string, unknown> | null,
) => ({
  todoId,
  eventType,
  actorUid: uid,
  source: "web",
  at: serverTimestamp(),
  before,
  after,
});

export const ensureSignedInUser = async (): Promise<string> => {
  if (!auth) {
    throw new Error("Firebase Auth is not configured");
  }

  if (auth.currentUser) {
    return auth.currentUser.uid;
  }

  const credential = await signInAnonymously(auth);
  return credential.user.uid;
};

export const subscribeTodos = (
  uid: string,
  onTasks: (tasks: FocusTask[]) => void,
  onError?: (error: unknown) => void,
) => {
  const todosQuery = query(
    getUserTodosCollection(uid),
    where("isDeleted", "==", false),
    orderBy("updatedAt", "desc"),
  );

  return onSnapshot(
    todosQuery,
    (snapshot) => {
      const tasks = snapshot.docs.map((snapshotDoc) => {
        const data = snapshotDoc.data() as TodoDoc;
        return {
          id: snapshotDoc.id,
          title: data.title,
          minutes: data.minutes,
          done: data.done,
        };
      });

      onTasks(tasks);
    },
    (error) => {
      if (onError) {
        onError(error);
      }
    },
  );
};

export const createTodo = async (uid: string, title: string, minutes: number) => {
  const todosCollection = getUserTodosCollection(uid);
  const eventsCollection = getUserEventsCollection(uid);

  const todoRef = doc(todosCollection);
  const eventRef = doc(eventsCollection);

  const batch = writeBatch(db!);
  const todoData = {
    title,
    minutes,
    done: false,
    isDeleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    completedAt: null,
    deletedAt: null,
    version: 1,
    lastEventType: "created",
  };

  batch.set(todoRef, todoData);
  batch.set(
    eventRef,
    makeEventPayload(uid, todoRef.id, "created", null, {
      title,
      minutes,
      done: false,
    }),
  );

  await batch.commit();
};

export const toggleTodoDone = async (uid: string, task: FocusTask) => {
  const todosCollection = getUserTodosCollection(uid);
  const eventsCollection = getUserEventsCollection(uid);
  const todoRef = doc(todosCollection, task.id);
  const eventRef = doc(eventsCollection);

  const nextDone = !task.done;
  const eventType: EventType = nextDone ? "completed" : "reopened";

  const batch = writeBatch(db!);
  batch.update(todoRef, {
    done: nextDone,
    completedAt: nextDone ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
    version: task.done ? 3 : 2,
    lastEventType: eventType,
  });

  batch.set(
    eventRef,
    makeEventPayload(
      uid,
      task.id,
      eventType,
      { done: task.done },
      { done: nextDone },
    ),
  );

  await batch.commit();
};

export const softDeleteTodo = async (uid: string, task: FocusTask) => {
  const todosCollection = getUserTodosCollection(uid);
  const eventsCollection = getUserEventsCollection(uid);
  const todoRef = doc(todosCollection, task.id);
  const eventRef = doc(eventsCollection);

  const batch = writeBatch(db!);
  batch.update(todoRef, {
    isDeleted: true,
    deletedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    version: 4,
    lastEventType: "deleted",
  });

  batch.set(
    eventRef,
    makeEventPayload(uid, task.id, "deleted", { isDeleted: false }, { isDeleted: true }),
  );

  await batch.commit();
};
