import { storage } from "./storage";

async function seedDatabase() {
  console.log("Seeding database with classic D&D, modern D&D 5e, and Cyberpunk adventure modules...");

  const sampleRpgs = [
    {
      title: "A1 Slave Pits of the Undercity",
      description: "The first adventure in the classic Slavers series. Characters discover a network of slave pits beneath the city and must navigate dangerous underground complexes to free the captives and uncover the slave trade conspiracy.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1980,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "A2 Secret of the Slavers Stockade",
      description: "The second adventure in the Slavers series. Heroes infiltrate a heavily fortified stockade where slaves are held before being shipped to distant lands, uncovering more of the slavers' organization.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1981,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "A3 Assault on the Aerie of the Slave Lords",
      description: "The third adventure in the Slavers series takes the party to a mountain fortress where they must assault the stronghold of the Slave Lords themselves in a climactic battle.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1981,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "A4 In the Dungeons of the Slave Lords",
      description: "The finale of the Slavers series. Captured and stripped of equipment, the heroes must escape from the Slave Lords' dungeons using only their wits and whatever they can find.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1981,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "C1 The Hidden Shrine of Tamoachan",
      description: "An ancient Mesoamerican-inspired temple complex filled with deadly traps, puzzles, and treasures. This tournament module challenges players with exploration and problem-solving.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1980,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "C2 The Ghost Tower of Inverness",
      description: "A mysterious tower appears and disappears, and the party must explore its haunted halls to recover stolen magical items. Features unique ghostly encounters and time-based challenges.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1980,
      imageUrl: "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "D1 Descent into the Depths of the Earth",
      description: "The first adventure in the classic Underdark series. Following the defeat of the giants, heroes pursue dark elves deep underground into their alien realm.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1978,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "D2 Shrine of the Kuo-Toa",
      description: "Continuing the Underdark saga, heroes encounter the fish-like kuo-toa and their bizarre underwater shrine. Features unique aquatic encounters and alien cultures.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1978,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "D3 Vault of the Drow",
      description: "The climax of the Underdark series takes heroes to the dark elves' city. Political intrigue, deadly combat, and the alien society of the drow await.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1978,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "G1 Steading of the Hill Giant Chief",
      description: "The first adventure in the legendary Against the Giants series. Heroes assault the wooden fortress of the hill giant chief to end raids on human settlements.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1978,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "G2 Glacial Rift of the Frost Giant Jarl",
      description: "The second Against the Giants adventure. Heroes venture to an icy mountain stronghold to confront frost giants in their frozen domain.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1978,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "G3 Hall of the Fire Giant King",
      description: "The finale of Against the Giants. Heroes infiltrate the fire giants' volcanic fortress and uncover the dark elf conspiracy behind the giant raids.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1978,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "I1 Dwellers of the Forbidden City",
      description: "Explore a ruined city overrun by yuan-ti and other reptilian creatures. This jungle adventure features exploration, mystery, and dangerous encounters with serpentfolk.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1981,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "I3 Pharaoh",
      description: "The first part of the Desert of Desolation series. Heroes explore an ancient Egyptian-style pyramid filled with traps, undead, and treasures of a long-dead pharaoh.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1982,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "I6 Ravenloft",
      description: "The most famous horror adventure in D&D history. Heroes are drawn into the mysterious realm of Barovia where they must confront the vampire Count Strahd von Zarovich in his castle.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1983,
      imageUrl: "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Q1 Queen of the Demonweb Pits",
      description: "The epic conclusion to the GDQ series. Heroes travel to the Abyss itself to confront Lolth, the demon queen of spiders, in her own domain.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1980,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "S1 Tomb of Horrors",
      description: "The ultimate deathtrap dungeon designed by Gary Gygax himself. A legendary test of player skill and character survivability with deadly traps and puzzles.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1978,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "S2 White Plume Mountain",
      description: "A bizarre and deadly mountain dungeon filled with strange traps, weird magic, and three legendary weapons to recover. Known for its creative and unusual challenges.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1979,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "S3 Expedition to the Barrier Peaks",
      description: "A unique blend of fantasy and science fiction. Heroes explore a crashed spaceship, encountering aliens, robots, and futuristic technology in this genre-bending adventure.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1980,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "S4 The Lost Caverns of Tsojcanth",
      description: "Explore the hidden caverns where the archmage Iggwilv once dwelled. Features challenging encounters, magical treasures, and connections to Greyhawk lore.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1982,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "T1 The Village of Hommlet",
      description: "The introduction to the Temple of Elemental Evil campaign. Heroes investigate a seemingly peaceful village harboring dark secrets and cultist activities.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1979,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "T1-4 The Temple of Elemental Evil",
      description: "The complete Temple of Elemental Evil super-module. A massive campaign involving the village of Hommlet and the notorious temple where elemental cults gather.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1985,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "U1 The Sinister Secret of Saltmarsh",
      description: "The first adventure in the Saltmarsh series. Heroes investigate a supposedly haunted house by the sea, uncovering smugglers and maritime mysteries.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1981,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "U2 Danger at Dunwater",
      description: "The second Saltmarsh adventure. Heroes discover a lizardfolk settlement and must navigate complex negotiations while uncovering a greater threat from the sea.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1982,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "U3 The Final Enemy",
      description: "The climax of the Saltmarsh series. Heroes confront the sahuagin threat in an underwater fortress, requiring aquatic combat and exploration.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "AD&D 1e",
      publisher: "TSR",
      yearPublished: 1983,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    // Cyberpunk 2013 Adventures (First Edition)
    {
      title: "Friday Night Firefight",
      description: "A classic Cyberpunk 2013 adventure featuring intense combat scenarios in Night City. Players face corporate assassins and street gangs in this gritty urban warfare adventure.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk 2013",
      publisher: "R. Talsorian Games",
      yearPublished: 1988,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "The Arasaka Brainworm",
      description: "Corporate espionage meets cybernetic horror in this early Cyberpunk adventure. Players must infiltrate Arasaka corporation while dealing with dangerous neural implants.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk 2013",
      publisher: "R. Talsorian Games",
      yearPublished: 1988,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "The Rockerboy Murders",
      description: "A mystery adventure in the world of Cyberpunk 2013. Players investigate a series of murders targeting rockerboys in Night City's underground music scene.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk 2013",
      publisher: "R. Talsorian Games",
      yearPublished: 1988,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    // Cyberpunk 2020 Adventures
    {
      title: "CP3020 The Big Sleep",
      description: "The first major adventure for Cyberpunk 2020. A noir-inspired adventure involving corporate conspiracy, betrayal, and the dark underbelly of Night City.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1990,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "CP3030 The Arasaka Brainworm",
      description: "Updated version of the classic adventure for Cyberpunk 2020. Enhanced corporate espionage thriller with improved mechanics and expanded storyline.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1990,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "CP3040 Eurotour",
      description: "Take your cyberpunk adventures to Europe. Explore the corporate battlegrounds of 2020s Europe with new locations, NPCs, and high-tech conspiracies.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1991,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "CP3050 Cabin Fever",
      description: "A wilderness survival adventure with a cyberpunk twist. Players must survive in remote locations while corporate hunters track them with advanced technology.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1991,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "CP3080 Land of the Free",
      description: "Explore the American heartland in 2020. This adventure takes players beyond Night City to discover how cyberpunk themes play out in rural America.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1992,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "CP3301 Greenwar",
      description: "Environmental terrorism meets corporate warfare. Players navigate the dangerous world of eco-terrorists and mega-corporations in this politically charged adventure.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1993,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "CP3302 EuroWar 2: Soldiers of Fortune",
      description: "Military action in the European theater. Players take on the roles of mercenaries in the ongoing conflicts between European mega-corporations.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1993,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "CP3303 Night City Stories",
      description: "A collection of short adventures set in Night City. Multiple scenarios ranging from street-level operations to corporate boardroom intrigue.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1993,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "CP3341 The Bonin Horse",
      description: "A Pacific Rim adventure featuring corporate espionage and high-tech warfare. Players navigate the complex politics of Asian mega-corporations.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1994,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "CP3370 Home of the Brave",
      description: "Return to America for domestic corporate warfare. This adventure explores the impact of mega-corporations on traditional American values and institutions.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1994,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "CP3510 Firestorm: Stormfront",
      description: "The beginning of the Fourth Corporate War. Players experience the opening battles that will reshape the cyberpunk world forever.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1997,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "CP3520 Firestorm: Shockwave",
      description: "The climactic conclusion of the Fourth Corporate War. Experience the devastating end of an era as Arasaka and Militech face off in final combat.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1997,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "CP3601 When Gravity Fails",
      description: "Based on George Alec Effinger's acclaimed novel. A noir detective story set in the Middle East of the cyberpunk future, featuring mind-altering technology.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1995,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "CP3791 Tales from the Forlorn Hope",
      description: "Military adventures in the Cyberpunk universe. Players take on dangerous missions as members of elite combat units in corporate conflicts.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1996,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "CP3801 The Chrome Berets",
      description: "Elite military unit adventures featuring high-tech warfare and special operations. Players join an elite cybernetically enhanced military unit.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1996,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "CP3802 The Pacific Rim Sourcebook",
      description: "Contains adventure hooks and scenarios set in the Pacific Rim. Explore the corporate battlegrounds of Asia with new locations and challenges.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1996,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "CP3891 Never Fade Away",
      description: "The signature adventure from the Cyberpunk 2020 core book. Follow the legendary rockerboy Johnny Silverhand in his fight against corporate oppression.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1990,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    // Cyberpunk Red Adventures
    {
      title: "Cyberpunk Red: The Apartment",
      description: "The introductory adventure for Cyberpunk Red. Players investigate a mysterious apartment in Night City, uncovering corporate conspiracies and street-level dangers.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk Red",
      publisher: "R. Talsorian Games",
      yearPublished: 2020,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Tales of the Red: Street Stories",
      description: "A collection of street-level adventures for Cyberpunk Red. Multiple scenarios focusing on the gritty day-to-day survival in the Time of the Red.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk Red",
      publisher: "R. Talsorian Games",
      yearPublished: 2021,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Black Chrome",
      description: "High-end gear and dangerous missions for Cyberpunk Red. Features new equipment, vehicles, and adventure scenarios for experienced edgerunners.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk Red",
      publisher: "R. Talsorian Games",
      yearPublished: 2022,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Danger Gal Dossier",
      description: "Solo-focused adventures and character options for Cyberpunk Red. Explore the dangerous world of corporate security and freelance enforcement.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk Red",
      publisher: "R. Talsorian Games",
      yearPublished: 2022,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Interface RED Volume 1",
      description: "Netrunner-focused adventures and expanded cyberspace rules. Dive deep into the dangerous world of corporate data theft and cyber warfare.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk Red",
      publisher: "R. Talsorian Games",
      yearPublished: 2023,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Interface RED Volume 2",
      description: "Advanced netrunning adventures and expanded NET architecture. Continue exploring the depths of cyberspace with new threats and opportunities.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk Red",
      publisher: "R. Talsorian Games",
      yearPublished: 2024,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    // Specialty & Supplement Adventures
    {
      title: "Solo of Fortune 1",
      description: "Adventure seeds and scenarios focused on Solo characters. Contains numerous mission hooks and dangerous contracts for hired guns and mercenaries.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1992,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Solo of Fortune 2",
      description: "More adventure seeds and combat scenarios for Solo characters. Features expanded rules for military operations and mercenary work.",
      genre: "sci-fi" as const,
      type: "adventure" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1994,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Night City Sourcebook",
      description: "The definitive guide to Night City including adventures and missions. Explore every district of the most dangerous city in the cyberpunk world.",
      genre: "sci-fi" as const,
      type: "setting" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1991,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Hardwired Sourcebook",
      description: "Based on Walter Jon Williams' novel, includes missions and adventures. Explore a different take on the cyberpunk genre with unique characters and situations.",
      genre: "sci-fi" as const,
      type: "setting" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1989,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Wildside",
      description: "Fixer-oriented adventure hooks and scenarios. Navigate the complex world of deal-making, information brokering, and underground connections.",
      genre: "sci-fi" as const,
      type: "supplement" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1993,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Deep Space",
      description: "Space missions and adventures beyond Earth. Explore corporate conflicts in orbital stations, lunar colonies, and deep space installations.",
      genre: "sci-fi" as const,
      type: "supplement" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1992,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Rough Guide to the UK",
      description: "Missions and adventures set in cyberpunk Britain. Explore the corporate dystopia of future London and other British cities.",
      genre: "sci-fi" as const,
      type: "supplement" as const,
      system: "Cyberpunk 2020",
      publisher: "R. Talsorian Games",
      yearPublished: 1994,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    // D&D 5th Edition Adventures (2014-2024)
    {
      title: "Hoard of the Dragon Queen",
      description: "The first part of the Tyranny of Dragons storyline. Heroes must stop the Cult of the Dragon from freeing Tiamat from the Nine Hells in this epic campaign.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "D&D 5e",
      publisher: "Wizards of the Coast",
      yearPublished: 2014,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "The Rise of Tiamat",
      description: "The epic conclusion to the Tyranny of Dragons storyline. Heroes face the return of Tiamat herself in this climactic high-level adventure.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "D&D 5e",
      publisher: "Wizards of the Coast",
      yearPublished: 2014,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Princes of the Apocalypse",
      description: "Elemental evil threatens the Forgotten Realms. Heroes must stop four elemental cults from unleashing devastation across the Sword Coast.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "D&D 5e",
      publisher: "Wizards of the Coast",
      yearPublished: 2015,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Out of the Abyss",
      description: "Escape the Underdark in this harrowing adventure. Heroes must survive the demon-infested depths while demon lords wage war in the world below.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "D&D 5e",
      publisher: "Wizards of the Coast",
      yearPublished: 2015,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Curse of Strahd",
      description: "Enter the gothic horror realm of Barovia and face the vampire lord Strahd von Zarovich. A masterpiece of horror-themed D&D adventure design.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "D&D 5e",
      publisher: "Wizards of the Coast",
      yearPublished: 2016,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Storm King's Thunder",
      description: "Giants have emerged from their strongholds to threaten civilization. Heroes must navigate giant politics and ancient grudges in this epic adventure.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "D&D 5e",
      publisher: "Wizards of the Coast",
      yearPublished: 2016,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Tales from the Yawning Portal",
      description: "Seven classic D&D adventures updated for 5th edition, from the Sunless Citadel to Tomb of Horrors. A collection spanning D&D's greatest dungeons.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "D&D 5e",
      publisher: "Wizards of the Coast",
      yearPublished: 2017,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Tomb of Annihilation",
      description: "Explore the deadly jungle peninsula of Chult to find and destroy the Soulmonger. A challenging adventure featuring dinosaurs, undead, and ancient curses.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "D&D 5e",
      publisher: "Wizards of the Coast",
      yearPublished: 2017,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Waterdeep: Dragon Heist",
      description: "Urban intrigue in the City of Splendors. Heroes navigate political schemes, criminal organizations, and treasure hunts in this city-based adventure.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "D&D 5e",
      publisher: "Wizards of the Coast",
      yearPublished: 2018,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Waterdeep: Dungeon of the Mad Mage",
      description: "Explore the massive 23-level mega-dungeon beneath Waterdeep. Face the Mad Mage Halaster Blackcloak in his twisted domain of Undermountain.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "D&D 5e",
      publisher: "Wizards of the Coast",
      yearPublished: 2018,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Ghosts of Saltmarsh",
      description: "Classic nautical adventures updated for 5th edition. Explore the haunted coastal town of Saltmarsh and face threats from sea and shore.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "D&D 5e",
      publisher: "Wizards of the Coast",
      yearPublished: 2019,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Baldur's Gate: Descent into Avernus",
      description: "Journey from Baldur's Gate to the first layer of the Nine Hells. Redeem fallen angels and battle devils in this infernal adventure.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "D&D 5e",
      publisher: "Wizards of the Coast",
      yearPublished: 2019,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Icewind Dale: Rime of the Frostmaiden",
      description: "Survive the endless winter gripping Icewind Dale. Uncover dark secrets and face cosmic horror in this chilling northern adventure.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "D&D 5e",
      publisher: "Wizards of the Coast",
      yearPublished: 2020,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Candlekeep Mysteries",
      description: "Seventeen mystery adventures set in and around the legendary library fortress of Candlekeep. Each tale begins with a mysterious book.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "D&D 5e",
      publisher: "Wizards of the Coast",
      yearPublished: 2021,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "The Wild Beyond the Witchlight",
      description: "A whimsical adventure through the Feywild. Experience a carnival of wonders and face the hags of Prismeer in this imaginative adventure.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "D&D 5e",
      publisher: "Wizards of the Coast",
      yearPublished: 2021,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Critical Role: Call of the Netherdeep",
      description: "An adventure set in the world of Critical Role's Exandria. Follow the story of Alyxian the Apotheon in this epic cross-continental campaign.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "D&D 5e",
      publisher: "Wizards of the Coast",
      yearPublished: 2022,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Journeys Through the Radiant Citadel",
      description: "Thirteen adventures inspired by different cultures around the world. Explore the Radiant Citadel, a bastion of civilization in the Ethereal Plane.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "D&D 5e",
      publisher: "Wizards of the Coast",
      yearPublished: 2022,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Dragonlance: Shadow of the Dragon Queen",
      description: "Return to the world of Krynn during the War of the Lance. Face the Dragon Armies and witness the rise of new heroes in this classic setting.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "D&D 5e",
      publisher: "Wizards of the Coast",
      yearPublished: 2022,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Phandelver and Below: The Shattered Obelisk",
      description: "An expanded version of the classic Lost Mine of Phandelver, taking heroes deeper into the mysteries beneath the town of Phandalin.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "D&D 5e",
      publisher: "Wizards of the Coast",
      yearPublished: 2023,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Planescape: Adventures in the Multiverse",
      description: "Explore the infinite planes of existence in this planar adventure anthology. Visit Sigil, the City of Doors, and beyond.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "D&D 5e",
      publisher: "Wizards of the Coast",
      yearPublished: 2023,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Vecna: Eve of Ruin",
      description: "The ultimate high-level D&D adventure. Face the archlich Vecna as he attempts to remake the multiverse in his own image across multiple planes.",
      genre: "fantasy" as const,
      type: "adventure" as const,
      system: "D&D 5e",
      publisher: "Wizards of the Coast",
      yearPublished: 2024,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    // Call of Cthulhu Adventures (Horror Genre)
    {
      title: "The Masks of Nyarlathotep",
      description: "The quintessential globe-spanning Cthulhu campaign set in the 1920s. Investigators follow clues across multiple continents to stop a world-ending conspiracy involving the Crawling Chaos.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 1984,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Horror on the Orient Express",
      description: "An epic 1920s Europe train-based campaign. Investigators journey across Europe on the legendary Orient Express, facing supernatural horrors and ancient evils.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 1991,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Shadows of Yog-Sothoth",
      description: "A globe-spanning campaign involving secret societies and cosmic horror. Investigators uncover a conspiracy reaching across continents and dimensions.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 1982,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Beyond the Mountains of Madness",
      description: "An Antarctica expedition sequel to Lovecraft's 'At the Mountains of Madness'. Investigators venture into the frozen wasteland to uncover ancient secrets.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 1999,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "The Fungi from Yuggoth",
      description: "Also known as 'The Day of the Beast'. A campaign involving the alien fungi and their sinister plans for Earth.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 1984,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "The Tatters of the King",
      description: "UK-based surreal psychological horror campaign. Investigators encounter the Yellow Sign and the malevolent influence of Hastur.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 2002,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Escape from Innsmouth",
      description: "Includes 'The Raid on Innsmouth' mini-campaign. Investigators must escape the fish-cursed town of Innsmouth and its Deep One inhabitants.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 1997,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Walker in the Wastes",
      description: "Set in Canada, the Arctic, and ancient ruins. Investigators face primordial horrors in the frozen wilderness.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 2004,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "The Two-Headed Serpent",
      description: "Pulp Cthulhu global action-horror campaign. High-octane adventure across multiple continents with pulp action sensibilities.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Pulp Cthulhu",
      publisher: "Chaosium",
      yearPublished: 2017,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "A Time to Harvest",
      description: "Set in Vermont around Miskatonic University. A Mi-Go-focused campaign dealing with alien fungi and their harvest of human minds.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 1999,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Children of Fear",
      description: "1920s Central Asia and Tibet mythos campaign. Investigators journey to the roof of the world to face ancient terrors.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 2003,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Shadows of Atlantis",
      description: "Achtung! Cthulhu adventure for Pulp Cthulhu. Investigators battle occult Nazis and ancient Atlantean horrors.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Pulp Cthulhu",
      publisher: "Modiphius Entertainment",
      yearPublished: 2017,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "The Reign of Terror",
      description: "French Revolution Mythos horror campaign. Investigators navigate the political chaos of revolutionary France while facing cosmic terror.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 2016,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "The Smoking Mirror",
      description: "Pulp Cthulhu adventure set in Mexico. Investigators face Aztec-inspired horrors and ancient evils in 1930s Mexico.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Pulp Cthulhu",
      publisher: "Chaosium",
      yearPublished: 2018,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Legacy of Arrius Lurco",
      description: "Ancient Rome campaign for Cthulhu Invictus. Investigators in the Roman Empire face mythos horrors among the legions and senators.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Cthulhu Invictus",
      publisher: "Chaosium",
      yearPublished: 2009,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "The Curse of Seven",
      description: "Collection of linked scenarios from the 7th Edition Kickstarter. Seven interconnected adventures forming a complete campaign.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 2014,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Dreams of the Witch House",
      description: "Linked dream-based adventures inspired by Lovecraft's story. Investigators explore the dangerous realm of dreams and nightmares.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 2006,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Edge of Darkness",
      description: "Classic introductory scenario included in Quick Start rules. A perfect introduction to Call of Cthulhu's horror and investigation.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 2013,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "The Haunting",
      description: "The classic introductory scenario included in most rulebooks and starter kits. A haunted house investigation perfect for new players.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 1981,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Alone Against the Flames",
      description: "Solo adventure for Call of Cthulhu. A choose-your-own-adventure style introduction to the game's mechanics and atmosphere.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 2017,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Paper Chase",
      description: "Classic Call of Cthulhu scenario involving mysterious documents and academic horror at Miskatonic University.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 1985,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Dead Man Stomp",
      description: "Jazz Age horror scenario set in the world of 1920s music and nightlife. Investigators face supernatural threats in speakeasies and dance halls.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 1995,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "The Darkness Beneath the Hill",
      description: "Rural horror scenario involving ancient evils buried beneath seemingly peaceful countryside.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 2008,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Cthulhu by Gaslight",
      description: "Victorian England adventures collection. Investigators face mythos horrors in the fog-shrouded streets of Victorian London.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 1986,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Down Darker Trails",
      description: "Weird West adventures including 'Incident at Beaver Creek' and 'Shoshone Trails'. Horror meets the American frontier.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 2017,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Cold Harvest",
      description: "Soviet Russia solo adventure. Investigators navigate the horrors of Stalinist Russia while facing cosmic terror.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 2018,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Berlin: The Wicked City",
      description: "1920s Berlin adventures. Investigators face decadence, political turmoil, and mythos horrors in Weimar-era Germany.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 2016,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "Cthulhu Dark Ages",
      description: "Medieval horror adventures. Investigators face mythos terrors in a world of knights, castles, and religious fervor.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 2004,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "The Things We Leave Behind",
      description: "Modern horror with adult themes from Stygian Fox. Mature investigators face contemporary mythos threats and psychological horror.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Stygian Fox Publishing",
      yearPublished: 2020,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "The Lightless Beacon",
      description: "Free RPG Day release scenario. Investigators explore a mysterious lighthouse and its dark secrets.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 2016,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      title: "The Dare",
      description: "1980s kids horror scenario. Young investigators dare each other to enter a haunted house, with terrifying consequences.",
      genre: "horror" as const,
      type: "adventure" as const,
      system: "Call of Cthulhu",
      publisher: "Chaosium",
      yearPublished: 2019,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    // Boot Hill Historical Western Adventures
    {
      title: "BH1 Mad Mesa",
      description: "A sandbox-style town adventure with plot hooks, outlaws, and lawmen clashing in a frontier town. Designed for solo or referee-led play.",
      system: "Boot Hill",
      genre: "historical" as const,
      publisher: "TSR",
      yearPublished: 1981,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 7.2,
      theme: "action",
      summary: "Frontier town conflict with outlaws and lawmen",
      adventureType: "module"
    },
    {
      title: "BH2 Lost Conquistador Mine",
      description: "Focused on the search for a legendary lost Spanish gold mine, with plenty of wilderness exploration, shootouts, and treasure hunting.",
      system: "Boot Hill",
      genre: "historical" as const,
      publisher: "TSR",
      yearPublished: 1982,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 7.5,
      theme: "action",
      summary: "Treasure hunt for legendary Spanish gold mine",
      adventureType: "module"
    },
    {
      title: "BH3 Ballots & Bullets",
      description: "A unique political Western scenario involving a town election where factions vie for power, often resorting to gunplay to influence the outcome.",
      system: "Boot Hill",
      genre: "historical" as const,
      publisher: "TSR",
      yearPublished: 1982,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 7.8,
      theme: "action",
      summary: "Political intrigue in frontier town election",
      adventureType: "module"
    },
    {
      title: "BH4 Burned Bush Wells",
      description: "Town-focused adventure with conspiracies, hired guns, and tense shootouts in a water-starved settlement.",
      system: "Boot Hill",
      genre: "historical" as const,
      publisher: "TSR",
      yearPublished: 1983,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1504746350726-3ae91a0f5b0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 7.4,
      theme: "action",
      summary: "Water-starved settlement with conspiracies and hired guns",
      adventureType: "module"
    },
    // Modern/Urban Horror Adventures (Call of Cthulhu & Delta Green)
    {
      title: "The Last Equation",
      description: "Modern mythos scenario dealing with dangerous mathematics and cosmic horror in contemporary settings.",
      system: "Call of Cthulhu",
      genre: "modern" as const,
      publisher: "Chaosium",
      yearPublished: 2010,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.1,
      theme: "horror",
      summary: "Dangerous mathematics and cosmic horror in modern settings",
      adventureType: "one-shot"
    },
    {
      title: "Night Floors",
      description: "Original surreal office horror scenario later expanded into Impossible Landscapes. Modern corporate nightmare with reality-bending elements.",
      system: "Delta Green",
      genre: "modern" as const,
      publisher: "Arc Dream Publishing",
      yearPublished: 1997,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.5,
      theme: "horror",
      summary: "Surreal office horror with reality-bending elements",
      adventureType: "one-shot"
    },
    {
      title: "A Victim of the Art",
      description: "Modern art world horror scenario exploring the dangerous intersection of creativity and cosmic terror.",
      system: "Delta Green",
      genre: "modern" as const,
      publisher: "Arc Dream Publishing",
      yearPublished: 2016,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.3,
      theme: "horror",
      summary: "Art world horror with cosmic terror elements",
      adventureType: "one-shot"
    },
    {
      title: "The Book of Rooms",
      description: "Modern reality-warping horror scenario featuring impossible architecture and psychological terror.",
      system: "Delta Green",
      genre: "modern" as const,
      publisher: "Arc Dream Publishing",
      yearPublished: 2019,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.7,
      theme: "horror",
      summary: "Reality-warping horror with impossible architecture",
      adventureType: "module"
    },
    {
      title: "A Volume of Secret Faces",
      description: "Collection of modern horror scenarios exploring identity, surveillance, and cosmic dread in contemporary society.",
      system: "Delta Green",
      genre: "modern" as const,
      publisher: "Arc Dream Publishing",
      yearPublished: 2020,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.4,
      theme: "horror",
      summary: "Modern horror exploring identity and surveillance themes",
      adventureType: "anthology"
    },
    {
      title: "The End of the World of the End",
      description: "Apocalyptic modern horror scenario dealing with the end times and cosmic terror in urban settings.",
      system: "Delta Green",
      genre: "modern" as const,
      publisher: "Arc Dream Publishing",
      yearPublished: 2021,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.6,
      theme: "horror",
      summary: "Apocalyptic horror with end times and cosmic terror",
      adventureType: "campaign"
    },
    {
      title: "Iconoclasts",
      description: "Middle East warzone campaign blending mythos horror with modern political themes and military action.",
      system: "Delta Green",
      genre: "modern" as const,
      publisher: "Arc Dream Publishing",
      yearPublished: 2022,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.8,
      theme: "horror",
      summary: "Middle East warzone with mythos horror and politics",
      adventureType: "campaign"
    },
    {
      title: "The Labyrinth",
      description: "Modern sourcebook featuring four major factions and extensive adventure hooks for ongoing urban horror campaigns.",
      system: "Delta Green",
      genre: "modern" as const,
      publisher: "Arc Dream Publishing",
      yearPublished: 2019,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1520637836862-4d197d17c90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.2,
      theme: "horror",
      summary: "Sourcebook with four factions and adventure hooks",
      adventureType: "setting-book"
    },
    {
      title: "Last Things Last",
      description: "Quickstart introductory scenario for Delta Green featuring modern government conspiracy and cosmic horror.",
      system: "Delta Green",
      genre: "modern" as const,
      publisher: "Arc Dream Publishing",
      yearPublished: 2016,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.0,
      theme: "horror",
      summary: "Government conspiracy with cosmic horror elements",
      adventureType: "one-shot"
    },
    {
      title: "Extremophilia",
      description: "Modern scientific horror scenario exploring the dangers of extremophile research and biological terror.",
      system: "Delta Green",
      genre: "modern" as const,
      publisher: "Arc Dream Publishing",
      yearPublished: 2018,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.3,
      theme: "horror",
      summary: "Scientific horror with extremophile research themes",
      adventureType: "one-shot"
    },
    {
      title: "Lover in the Ice",
      description: "Arctic research station horror scenario combining isolation, scientific discovery, and cosmic dread.",
      system: "Delta Green",
      genre: "modern" as const,
      publisher: "Arc Dream Publishing",
      yearPublished: 2019,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.7,
      theme: "horror",
      summary: "Arctic research station with isolation and cosmic dread",
      adventureType: "one-shot"
    },
    {
      title: "Observer Effect",
      description: "Modern quantum physics horror scenario exploring the dangerous intersection of science and the unknown.",
      system: "Delta Green",
      genre: "modern" as const,
      publisher: "Arc Dream Publishing",
      yearPublished: 2020,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.5,
      theme: "horror",
      summary: "Quantum physics horror with scientific themes",
      adventureType: "one-shot"
    },
    {
      title: "Music from a Darkened Room",
      description: "Modern horror scenario involving musical composition, sound manipulation, and psychological terror.",
      system: "Delta Green",
      genre: "modern" as const,
      publisher: "Arc Dream Publishing",
      yearPublished: 2019,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.4,
      theme: "horror",
      summary: "Musical horror with sound manipulation themes",
      adventureType: "one-shot"
    },
    {
      title: "Sweetness",
      description: "War-torn Syria setting blending modern conflict with cosmic horror and human tragedy.",
      system: "Delta Green",
      genre: "modern" as const,
      publisher: "Arc Dream Publishing",
      yearPublished: 2021,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.6,
      theme: "horror",
      summary: "War-torn Syria with cosmic horror and human tragedy",
      adventureType: "one-shot"
    },
    {
      title: "Future/Perfect Parts 1-4",
      description: "Four-part modern conspiracy campaign exploring technology, surveillance, and cosmic horror in digital age.",
      system: "Delta Green",
      genre: "modern" as const,
      publisher: "Arc Dream Publishing",
      yearPublished: 2017,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.9,
      theme: "horror",
      summary: "Technology conspiracy campaign in digital age",
      adventureType: "campaign"
    },
    {
      title: "Kelipah",
      description: "Modern religious horror scenario exploring mystical traditions and cosmic terror in urban settings.",
      system: "Delta Green",
      genre: "modern" as const,
      publisher: "Arc Dream Publishing",
      yearPublished: 2018,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.2,
      theme: "horror",
      summary: "Religious horror with mystical traditions",
      adventureType: "one-shot"
    },
    {
      title: "The Star Chamber",
      description: "Government conspiracy scenario involving judicial corruption and cosmic horror within modern legal systems.",
      system: "Delta Green",
      genre: "modern" as const,
      publisher: "Arc Dream Publishing",
      yearPublished: 2020,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.3,
      theme: "horror",
      summary: "Judicial corruption with cosmic horror elements",
      adventureType: "one-shot"
    },
    {
      title: "The Complex",
      description: "Collection of micro-locations with scenario hooks designed for drop-in modern horror gameplay.",
      system: "Delta Green",
      genre: "modern" as const,
      publisher: "Arc Dream Publishing",
      yearPublished: 2019,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.1,
      theme: "horror",
      summary: "Micro-locations with drop-in scenario hooks",
      adventureType: "anthology"
    },
    {
      title: "Night Visions",
      description: "Modern dream-based horror scenario exploring the boundary between sleep and cosmic terror.",
      system: "Delta Green",
      genre: "modern" as const,
      publisher: "Arc Dream Publishing",
      yearPublished: 2018,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.4,
      theme: "horror",
      summary: "Dream-based horror with cosmic terror elements",
      adventureType: "one-shot"
    },
    {
      title: "Operation ALICE",
      description: "Modern government operation involving artificial intelligence, surveillance technology, and cosmic horror.",
      system: "Delta Green",
      genre: "modern" as const,
      publisher: "Arc Dream Publishing",
      yearPublished: 2021,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.7,
      theme: "horror",
      summary: "AI surveillance operation with cosmic horror",
      adventureType: "campaign"
    },
    {
      title: "Operation FULMINATE: The Sentinels of Twilight",
      description: "Government operation targeting dangerous cult activity in modern urban environments with cosmic implications.",
      system: "Delta Green",
      genre: "modern" as const,
      publisher: "Arc Dream Publishing",
      yearPublished: 2020,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.5,
      theme: "horror",
      summary: "Government operation against dangerous cult activity",
      adventureType: "module"
    },
    // Superhero RPG Adventures
    // Mutants & Masterminds
    {
      title: "Time of Crisis",
      description: "Epic superhero crisis scenario featuring world-threatening events and major villain team-ups.",
      system: "Mutants & Masterminds",
      genre: "superhero" as const,
      publisher: "Green Ronin Publishing",
      yearPublished: 2004,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.4,
      theme: "action",
      summary: "Epic superhero crisis with world-threatening events",
      adventureType: "campaign"
    },
    {
      title: "Time of Vengeance",
      description: "Sequel to Time of Crisis featuring consequences and revenge plots from defeated villains.",
      system: "Mutants & Masterminds",
      genre: "superhero" as const,
      publisher: "Green Ronin Publishing",
      yearPublished: 2005,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.2,
      theme: "action",
      summary: "Revenge plots and consequences from defeated villains",
      adventureType: "campaign"
    },
    {
      title: "Freedom City Atlas Adventures",
      description: "Collection of location-based adventures throughout the iconic Freedom City setting.",
      system: "Mutants & Masterminds",
      genre: "superhero" as const,
      publisher: "Green Ronin Publishing",
      yearPublished: 2003,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.1,
      theme: "action",
      summary: "Location-based adventures in Freedom City",
      adventureType: "anthology"
    },
    {
      title: "The Silver Storm",
      description: "Cosmic-powered superhero adventure involving alien technology and silver-powered threats.",
      system: "Mutants & Masterminds",
      genre: "superhero" as const,
      publisher: "Green Ronin Publishing",
      yearPublished: 2006,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 7.9,
      theme: "action",
      summary: "Cosmic adventure with alien technology threats",
      adventureType: "module"
    },
    {
      title: "Hero High: The Adventure",
      description: "Teen superheroics adventure set in a high school for young heroes learning their powers.",
      system: "Mutants & Masterminds",
      genre: "superhero" as const,
      publisher: "Green Ronin Publishing",
      yearPublished: 2008,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 7.8,
      theme: "action",
      summary: "Teen superheroics in high school setting",
      adventureType: "module"
    },
    // Champions (Hero Games)
    {
      title: "The Island of Dr. Destroyer",
      description: "Classic Champions adventure featuring the iconic villain Dr. Destroyer on his island fortress.",
      system: "Champions",
      genre: "superhero" as const,
      publisher: "Hero Games",
      yearPublished: 1984,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.6,
      theme: "action",
      summary: "Classic villain Dr. Destroyer island fortress adventure",
      adventureType: "module"
    },
    {
      title: "Escape from Stronghold",
      description: "Prison break adventure set in the Champions universe's maximum security superhuman penitentiary.",
      system: "Champions",
      genre: "superhero" as const,
      publisher: "Hero Games",
      yearPublished: 1987,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1520637836862-4d197d17c90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.3,
      theme: "action",
      summary: "Prison break from superhuman maximum security facility",
      adventureType: "module"
    },
    {
      title: "Day of the Destroyer",
      description: "Major global catastrophe adventure featuring Dr. Destroyer's ultimate plan for world domination.",
      system: "Champions",
      genre: "superhero" as const,
      publisher: "Hero Games",
      yearPublished: 1992,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.8,
      theme: "action",
      summary: "Global catastrophe with Dr. Destroyer's world domination",
      adventureType: "campaign"
    },
    {
      title: "Champions Battlegrounds",
      description: "Multi-scenario anthology featuring various battleground locations and combat-focused adventures.",
      system: "Champions",
      genre: "superhero" as const,
      publisher: "Hero Games",
      yearPublished: 1989,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.0,
      theme: "action",
      summary: "Multi-scenario anthology with combat-focused adventures",
      adventureType: "anthology"
    },
    // Marvel Super Heroes (TSR)
    {
      title: "MH1: Secret Wars",
      description: "Epic crossover adventure based on the famous Marvel Comics event featuring heroes and villains on Battleworld.",
      system: "Marvel Super Heroes",
      genre: "superhero" as const,
      publisher: "TSR",
      yearPublished: 1985,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.9,
      theme: "action",
      summary: "Epic Marvel crossover event on Battleworld",
      adventureType: "campaign"
    },
    {
      title: "MH2: Murderworld!",
      description: "Deadly theme park adventure featuring Arcade's twisted mechanical death traps and challenges.",
      system: "Marvel Super Heroes",
      genre: "superhero" as const,
      publisher: "TSR",
      yearPublished: 1985,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.4,
      theme: "action",
      summary: "Arcade's deadly theme park with mechanical death traps",
      adventureType: "module"
    },
    {
      title: "MH7: The Left Hand of Eternity",
      description: "Cosmic-scale adventure involving universal threats and cosmic-powered heroes and villains.",
      system: "Marvel Super Heroes",
      genre: "superhero" as const,
      publisher: "TSR",
      yearPublished: 1987,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.7,
      theme: "action",
      summary: "Cosmic-scale adventure with universal threats",
      adventureType: "campaign"
    },
    {
      title: "MX1: Nightmares of Futures Past",
      description: "X-Men dystopian future mini-campaign based on the famous Days of Future Past storyline.",
      system: "Marvel Super Heroes",
      genre: "superhero" as const,
      publisher: "TSR",
      yearPublished: 1987,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.8,
      theme: "action",
      summary: "X-Men dystopian future based on Days of Future Past",
      adventureType: "campaign"
    },
    {
      title: "MT1: All This and World War II",
      description: "Time travel adventure taking heroes back to World War II to fight alongside historical figures.",
      system: "Marvel Super Heroes",
      genre: "superhero" as const,
      publisher: "TSR",
      yearPublished: 1988,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.5,
      theme: "action",
      summary: "Time travel to World War II with historical figures",
      adventureType: "module"
    },
    // DC Heroes RPG (Mayfair Games)
    {
      title: "The Doomsday Program",
      description: "Epic DC Universe adventure featuring the ultimate doomsday weapon threatening all of reality.",
      system: "DC Heroes",
      genre: "superhero" as const,
      publisher: "Mayfair Games",
      yearPublished: 1987,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.6,
      theme: "action",
      summary: "Ultimate doomsday weapon threatening all reality",
      adventureType: "campaign"
    },
    {
      title: "The Apokolips Factor",
      description: "Cosmic adventure involving Darkseid and the forces of Apokolips threatening Earth and beyond.",
      system: "DC Heroes",
      genre: "superhero" as const,
      publisher: "Mayfair Games",
      yearPublished: 1989,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.8,
      theme: "action",
      summary: "Darkseid and Apokolips forces threaten Earth",
      adventureType: "campaign"
    },
    // Icons Superpowered Roleplaying
    {
      title: "The Wheel of Justice",
      description: "Free introductory adventure showcasing the Icons system with classic superhero action.",
      system: "Icons",
      genre: "superhero" as const,
      publisher: "Ad Infinitum Adventures",
      yearPublished: 2010,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 7.9,
      theme: "action",
      summary: "Introductory adventure with classic superhero action",
      adventureType: "one-shot"
    },
    {
      title: "Great Power Adventures",
      description: "Collection of short scenarios tied to specific superpowers and superhero abilities.",
      system: "Icons",
      genre: "superhero" as const,
      publisher: "Ad Infinitum Adventures",
      yearPublished: 2012,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.1,
      theme: "action",
      summary: "Short scenarios tied to specific superpowers",
      adventureType: "anthology"
    },
    // Savage Worlds Super Powers
    {
      title: "Necessary Evil",
      description: "Original villain campaign where players take on the roles of supervillains fighting alien invaders.",
      system: "Savage Worlds",
      genre: "superhero" as const,
      publisher: "Pinnacle Entertainment",
      yearPublished: 2004,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.7,
      theme: "action",
      summary: "Supervillains fighting alien invaders campaign",
      adventureType: "campaign"
    },
    {
      title: "Necessary Evil: Breakout",
      description: "Prison break adventure for supervillains escaping from maximum security containment.",
      system: "Savage Worlds",
      genre: "superhero" as const,
      publisher: "Pinnacle Entertainment",
      yearPublished: 2005,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1520637836862-4d197d17c90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.3,
      theme: "action",
      summary: "Supervillain prison break from maximum security",
      adventureType: "module"
    },
    // Marvel Multiverse RPG
    {
      title: "Enter: Hydra",
      description: "Introductory adventure from the Marvel Multiverse RPG featuring the terrorist organization Hydra.",
      system: "Marvel Multiverse RPG",
      genre: "superhero" as const,
      publisher: "Marvel Publishing",
      yearPublished: 2023,
      type: "adventure" as const,
      imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600",
      averageRating: 8.0,
      theme: "action",
      summary: "Introductory adventure featuring Hydra terrorist organization",
      adventureType: "one-shot"
    }
  ];

  const sampleCategories = [
    {
      name: "General Discussion",
      description: "General RPG discussion and community chat",
      type: "general" as const
    },
    {
      name: "Game Reviews",
      description: "Share and discuss RPG reviews",
      type: "reviews" as const
    },
    {
      name: "Rules Discussion",
      description: "Discuss game mechanics and rules interpretations",
      type: "rules-discussion" as const
    },
    {
      name: "Play Reports",
      description: "Share stories from your gaming sessions",
      type: "play-reports" as const
    },
    {
      name: "Homebrew Content",
      description: "Share and discuss custom rules and content",
      type: "homebrew" as const
    }
  ];

  try {
    // Seed RPGs
    const createdRpgs = [];
    for (const rpg of sampleRpgs) {
      const created = await storage.createRpgItem(rpg);
      createdRpgs.push(created);
      console.log(`Created RPG: ${created.title}`);
    }

    // Seed forum categories
    for (const category of sampleCategories) {
      // Note: This would need the createForumCategory method in storage
      console.log(`Would create forum category: ${category.name}`);
    }

    console.log("Database seeding completed successfully!");
    return createdRpgs;
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("Seeding finished");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };