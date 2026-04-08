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

  // Death Note
  { text: "In this world, there are very few people who actually trust each other.", author: "L Lawliet", source: "deathnote" },
  { text: "An eye for an eye, my friend.", author: "L Lawliet", source: "deathnote" },
  { text: "I don't sit like this because I want to. I have to sit like this. If I were to sit normally, my deductive skills would drop by 40%.", author: "L Lawliet", source: "deathnote" },
  { text: "This world is rotten, and those who are making it rot deserve to die.", author: "Light Yagami", source: "deathnote" },
  { text: "I'll solve equations with my right hand and write names with my left.", author: "Light Yagami", source: "deathnote" },
  { text: "In every world, the gods always make the rules. You will fall before my fake rules.", author: "Light Yagami", source: "deathnote" },
  { text: "Learn to treasure your life because unfortunately, it can be taken away from you anytime.", author: "L Lawliet", source: "deathnote" },
  { text: "You can't ever win if you're always on the defensive.", author: "Light Yagami", source: "deathnote" },

  // Chess
  { text: "Every chess master was once a beginner.", author: "Irving Chernev", source: "chess" },
  { text: "Tactics is knowing what to do when there is something to do; strategy is knowing what to do when there is nothing to do.", author: "Savielly Tartakower", source: "chess" },
  { text: "The blunders are all there on the board, waiting to be made.", author: "Savielly Tartakower", source: "chess" },
  { text: "When you see a good move, look for a better one.", author: "Emanuel Lasker", source: "chess" },
  { text: "Chess is the struggle against the error.", author: "Johannes Zukertort", source: "chess" },
  { text: "You must take your opponent into a deep dark forest where 2+2=5, and the path leading out is only wide enough for one.", author: "Mikhail Tal", source: "chess" },
  { text: "Pawns are the soul of chess.", author: "François-André Philidor", source: "chess" },
  { text: "The pin is mightier than the sword.", author: "Fred Reinfeld", source: "chess" },
];

export const getRandomQuote = (): Quote => {
  return quotes[Math.floor(Math.random() * quotes.length)];
};
