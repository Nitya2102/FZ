export interface Quote {
  text: string;
  author: string;
  source: 'naruto' | 'deathnote' | 'chess';
}

export const quotes: Quote[] = [
  // Naruto
  { text: "A person grows up when he's able to overcome hardships. Protection is important, but there are some things that a person must learn on his own.", author: "Jiraiya", source: "naruto" },
  { text: "Hard work is worthless for those that don't believe in themselves.", author: "Naruto Uzumaki", source: "naruto" },
  { text: "If you don't like your destiny, don't accept it. Instead, have the courage to change it the way you want it to be.", author: "Naruto Uzumaki", source: "naruto" },
  { text: "The moment people come to know love, they run the risk of carrying hate.", author: "Obito Uchiha", source: "naruto" },
  { text: "Those who break the rules are scum, but those who abandon their friends are worse than scum.", author: "Kakashi Hatake", source: "naruto" },
  { text: "A genius who has put in effort is nothing but scary.", author: "Rock Lee", source: "naruto" },
  { text: "People become stronger because they have things they cannot forget.", author: "Tsunade", source: "naruto" },
  { text: "When you give up, your dreams and everything else, they're gone.", author: "Naruto Uzumaki", source: "naruto" },
  { text: "The difference between stupidity and genius, is that genius has its limits.", author: "Neji Hyūga", source: "naruto" },
  { text: "Laziness is the mother of all bad habits. But ultimately she's a mother and we should respect her.", author: "Shikamaru Nara", source: "naruto" },
  { text: "In the ninja world, those who don't follow the rules are trash. But those who abandon their friends are worse than trash.", author: "Kakashi Hatake", source: "naruto" },
  { text: "Power is not will, it is the phenomenon of physically making things happen.", author: "Madara Uchiha", source: "naruto" },
  { text: "Knowing what it feels like to be in pain, is exactly why we try to be kind to others.", author: "Jiraiya", source: "naruto" },
  { text: "Fear. That is what we live with. And we live it every day.", author: "Hinata Hyūga", source: "naruto" },
  { text: "The pain of being alone is not an easy one to bear.", author: "Gaara", source: "naruto" },
  { text: "Rejection is a part of any man's life.", author: "Jiraiya", source: "naruto" },

  // Death Note
  { text: "In this world, there are very few people who actually trust each other.", author: "L Lawliet", source: "deathnote" },
  { text: "An eye for an eye, my friend.", author: "L Lawliet", source: "deathnote" },
  { text: "I don't sit like this because I want to. I have to sit like this. If I were to sit normally, my deductive skills would drop by 40%.", author: "L Lawliet", source: "deathnote" },
  { text: "This world is rotten, and those who are making it rot deserve to die.", author: "Light Yagami", source: "deathnote" },
  { text: "I'll solve equations with my right hand and write names with my left.", author: "Light Yagami", source: "deathnote" },
  { text: "In every world, the gods always make the rules. You will fall before my fake rules.", author: "Light Yagami", source: "deathnote" },
  { text: "Learn to treasure your life because unfortunately, it can be taken away from you anytime.", author: "L Lawliet", source: "deathnote" },
  { text: "You can't ever win if you're always on the defensive.", author: "Light Yagami", source: "deathnote" },
  { text: "The human whose name is written in this note shall die.", author: "Ryuk", source: "deathnote" },
  { text: "Being alone is better than being with the wrong person.", author: "L Lawliet", source: "deathnote" },
  { text: "Sometimes, the questions are complicated and the answers are simple.", author: "L Lawliet", source: "deathnote" },
  { text: "No matter how gifted you are, you alone cannot change the world.", author: "L Lawliet", source: "deathnote" },
  { text: "Humans aren't made perfectly. Everyone lies.", author: "L Lawliet", source: "deathnote" },
  { text: "There's no heaven or hell. No matter what you do while you're alive, everybody goes to the same place once you die.", author: "L Lawliet", source: "deathnote" },

  // Chess
  { text: "Every chess master was once a beginner.", author: "Irving Chernev", source: "chess" },
  { text: "Tactics is knowing what to do when there is something to do; strategy is knowing what to do when there is nothing to do.", author: "Savielly Tartakower", source: "chess" },
  { text: "The blunders are all there on the board, waiting to be made.", author: "Savielly Tartakower", source: "chess" },
  { text: "When you see a good move, look for a better one.", author: "Emanuel Lasker", source: "chess" },
  { text: "Chess is the struggle against the error.", author: "Johannes Zukertort", source: "chess" },
  { text: "You must take your opponent into a deep dark forest where 2+2=5, and the path leading out is only wide enough for one.", author: "Mikhail Tal", source: "chess" },
  { text: "Pawns are the soul of chess.", author: "François-André Philidor", source: "chess" },
  { text: "The pin is mightier than the sword.", author: "Fred Reinfeld", source: "chess" },
  { text: "Chess, like love, like music, has the power to make men happy.", author: "Siegbert Tarrasch", source: "chess" },
  { text: "Chess is life in miniature.", author: "Garry Kasparov", source: "chess" },
  { text: "Chess is a war over the board. The object is to crush the opponent's mind.", author: "Bobby Fischer", source: "chess" },
  { text: "The hardest game to win is a won game.", author: "Emanuel Lasker", source: "chess" },
  { text: "Without error there can be no brilliancy.", author: "Emanuel Lasker", source: "chess" },
  { text: "Help your pieces so they can help you.", author: "Paul Morphy", source: "chess" },
];

export const getRandomQuote = (): Quote => {
  return quotes[Math.floor(Math.random() * quotes.length)];
};
