/**
 * Comprehensive RPG Category System for The RPG Vault
 * Organized hierarchical structure with main categories and subcategories
 */

export interface SubCategory {
  id: string;
  name: string;
  description?: string;
  examples?: string[];
}

export interface MainCategory {
  id: string;
  name: string;
  description?: string;
  subcategories: SubCategory[];
}

export const RPG_CATEGORIES: MainCategory[] = [
  {
    id: "fantasy",
    name: "Fantasy",
    description: "Role-playing games set in magical worlds with supernatural elements",
    subcategories: [
      {
        id: "high-fantasy",
        name: "High Fantasy",
        description: "Epic fantasy with extensive magic systems and complex worlds",
        examples: ["D&D", "Pathfinder", "The One Ring"]
      },
      {
        id: "low-fantasy",
        name: "Low Fantasy",
        description: "Grounded fantasy with limited magic in realistic settings",
        examples: ["The Witcher TRPG", "Song of Ice and Fire RPG"]
      },
      {
        id: "sword-sorcery",
        name: "Sword & Sorcery",
        description: "Action-focused fantasy with heroic adventures",
        examples: ["Conan: Adventures in an Age Undreamed Of", "Hyperborea"]
      },
      {
        id: "urban-fantasy",
        name: "Urban Fantasy",
        description: "Modern settings with hidden magical elements",
        examples: ["Urban Shadows", "World of Darkness", "Dresden Files RPG"]
      },
      {
        id: "dark-fantasy",
        name: "Dark Fantasy",
        description: "Gothic, horror-tinged fantasy settings",
        examples: ["Symbaroum", "Dark Souls RPG", "Zweihander"]
      }
    ]
  },
  {
    id: "science-fiction",
    name: "Science Fiction",
    description: "Future technology, space exploration, and speculative science",
    subcategories: [
      {
        id: "space-opera",
        name: "Space Opera",
        description: "Epic adventures across galaxies and star systems",
        examples: ["Star Wars", "Starfinder", "Fading Suns"]
      },
      {
        id: "hard-sci-fi",
        name: "Hard Science Fiction",
        description: "Scientifically accurate and technology-focused",
        examples: ["Traveller", "GURPS Space", "2300AD"]
      },
      {
        id: "cyberpunk",
        name: "Cyberpunk",
        description: "High-tech dystopian futures with corporate control",
        examples: ["Cyberpunk RED", "Shadowrun", "Interface Zero"]
      },
      {
        id: "post-apocalyptic",
        name: "Post-Apocalyptic",
        description: "Survival in devastated future worlds",
        examples: ["Fallout", "Mutant Year Zero", "Gamma World"]
      },
      {
        id: "transhumanist",
        name: "Transhumanist",
        description: "Enhanced humanity and consciousness transfer",
        examples: ["Eclipse Phase", "Transhuman Space"]
      },
      {
        id: "dystopian",
        name: "Dystopian Futures",
        description: "Oppressive future societies and totalitarian control",
        examples: ["Paranoia", "Kult", "Corporation"]
      }
    ]
  },
  {
    id: "horror",
    name: "Horror",
    description: "Fear, suspense, and supernatural terror",
    subcategories: [
      {
        id: "gothic-horror",
        name: "Gothic Horror",
        description: "Classic horror with vampires, ghosts, and dark atmosphere",
        examples: ["Ravenloft", "Vampire: The Masquerade", "Castles & Crusades"]
      },
      {
        id: "lovecraftian",
        name: "Lovecraftian Horror",
        description: "Cosmic horror and unknowable ancient entities",
        examples: ["Call of Cthulhu", "Delta Green", "Trail of Cthulhu"]
      },
      {
        id: "survival-horror",
        name: "Survival Horror",
        description: "Resource management and desperate survival",
        examples: ["Dread", "Ten Candles", "The Walking Dead RPG"]
      },
      {
        id: "psychological-horror",
        name: "Psychological Horror",
        description: "Mind-bending terror and internal fears",
        examples: ["Bluebeard's Bride", "Don't Rest Your Head", "Unknown Armies"]
      },
      {
        id: "slasher-horror",
        name: "Slasher Horror",
        description: "Stalking killers and violent confrontations",
        examples: ["Fear Itself", "Last Friday RPG", "Betrayal at House on the Hill"]
      }
    ]
  },
  {
    id: "historical",
    name: "Historical RPGs",
    description: "Real historical periods and authentic cultural settings",
    subcategories: [
      {
        id: "ancient-history",
        name: "Ancient History",
        description: "Classical antiquity and ancient civilizations",
        examples: ["Lex Arcana - Rome", "Mythic Rome", "Hellas"]
      },
      {
        id: "medieval",
        name: "Medieval",
        description: "Middle Ages without fantasy elements",
        examples: ["Lion & Dragon", "Chivalry & Sorcery", "Harn"]
      },
      {
        id: "renaissance",
        name: "Renaissance / Swashbuckling",
        description: "Age of exploration and dueling adventures",
        examples: ["7th Sea", "Lace & Steel", "Honor + Intrigue"]
      },
      {
        id: "western",
        name: "Western",
        description: "American frontier and cowboy adventures",
        examples: ["Deadlands", "Aces & Eights", "Dogs in the Vineyard"]
      },
      {
        id: "pirate",
        name: "Pirate/Nautical",
        description: "High seas adventure and maritime exploration",
        examples: ["Pirates of the Spanish Main", "50 Fathoms", "Skull & Shackles"]
      }
    ]
  },

  {
    id: "superhero",
    name: "Superhero RPGs",
    description: "Powered heroes protecting the world from evil",
    subcategories: [
      {
        id: "classic-superhero",
        name: "Classic Superheroes",
        description: "Traditional comic book heroes and villains",
        examples: ["Mutants & Masterminds", "Marvel Multiverse RPG", "Champions"]
      },
      {
        id: "dark-superhero",
        name: "Dark Superheroes",
        description: "Morally complex and gritty superhero stories",
        examples: ["Aberrant", "Necessary Evil", "Wild Talents"]
      },
      {
        id: "anime-superpowers",
        name: "Anime-Inspired Superpowers",
        description: "Over-the-top powers in anime-style adventures",
        examples: ["BESM", "OVA", "Magical Burst"]
      }
    ]
  },
  {
    id: "modern-urban",
    name: "Modern / Urban RPGs",
    description: "Contemporary settings with realistic themes",
    subcategories: [
      {
        id: "espionage",
        name: "Espionage / Spycraft",
        description: "International intrigue and secret missions",
        examples: ["Night's Black Agents", "Spycraft", "Top Secret"]
      },
      {
        id: "military-modern",
        name: "Military Modern",
        description: "Modern warfare and military operations",
        examples: ["Delta Green", "Twilight: 2000", "Recon"]
      },
      {
        id: "organized-crime",
        name: "Gangsters / Organized Crime",
        description: "Criminal underworld and mob activities",
        examples: ["Mafia RPG", "Cartel", "A Dirty World"]
      },
      {
        id: "slice-of-life",
        name: "Slice of Life / Realistic",
        description: "Everyday life and mundane adventures",
        examples: ["Golden Sky Stories", "Monsterhearts", "Smallville"]
      }
    ]
  },
  {
    id: "anime-manga",
    name: "Anime / Manga-Inspired RPGs",
    description: "Japanese animation and comic styles",
    subcategories: [
      {
        id: "mecha",
        name: "Mecha / Giant Robots",
        description: "Piloted robots and mechanical warfare",
        examples: ["Lancer", "Mobile Suit Gundam RPG", "Mekton"]
      },
      {
        id: "shonen-action",
        name: "Shonen Action",
        description: "High-energy adventures with growing protagonists",
        examples: ["OVA", "Big Eyes Small Mouth (BESM)", "Ryuutama"]
      },
      {
        id: "magical-girls",
        name: "Magical Girls",
        description: "Transforming heroines fighting evil with friendship",
        examples: ["Magical Burst", "Sailor Moon RPG", "Princess World"]
      }
    ]
  },
  {
    id: "steampunk-dieselpunk",
    name: "Steampunk / Dieselpunk / Atompunk",
    description: "Alternate history with retrofuturistic technology",
    subcategories: [
      {
        id: "steampunk",
        name: "Steampunk",
        description: "Victorian-era steam-powered technology",
        examples: ["Victoriana", "Tephra", "Castle Falkenstein"]
      },
      {
        id: "dieselpunk",
        name: "Dieselpunk",
        description: "1920s-1950s diesel and internal combustion aesthetics",
        examples: ["Skycrawl", "Deadlands Noir", "Weird War II"]
      },
      {
        id: "atompunk",
        name: "Atompunk / Retro-Futuristic",
        description: "1950s atomic age optimism and space exploration",
        examples: ["Rocket Age", "Atomic Highway", "Tales from the Loop"]
      }
    ]
  },
  {
    id: "science-fantasy",
    name: "Science Fantasy",
    description: "Blending magic with advanced technology",
    subcategories: [
      {
        id: "magic-tech-blend",
        name: "Magic-Tech Blends",
        description: "Seamless integration of mystical and technological elements",
        examples: ["Numenera", "Thirsty Sword Lesbians", "Rifts"]
      }
    ]
  },
  {
    id: "wuxia-eastern",
    name: "Wuxia / Eastern Fantasy",
    description: "Martial arts and Asian mythology",
    subcategories: [
      {
        id: "wuxia",
        name: "Wuxia",
        description: "Chinese martial arts heroes with supernatural abilities",
        examples: ["Wandering Heroes of Ogre Gate", "Righteous Blood, Ruthless Blades"]
      },
      {
        id: "eastern-mythology",
        name: "Eastern Mythology",
        description: "Asian cultural traditions and mythological beings",
        examples: ["Legend of the Five Rings", "Tenra Bansho Zero", "Oriental Adventures"]
      }
    ]
  },
  {
    id: "mythological",
    name: "Mythological RPGs",
    description: "Gods, legends, and ancient mythological traditions",
    subcategories: [
      {
        id: "general-mythology",
        name: "General Mythology",
        description: "Various mythological traditions and pantheons",
        examples: ["Scion", "Godbound", "Mythic"]
      }
    ]
  },
  {
    id: "comedy-satirical",
    name: "Comedy / Satirical RPGs",
    description: "Humorous and parody games",
    subcategories: [
      {
        id: "comedy",
        name: "Comedy",
        description: "Light-hearted and funny adventures",
        examples: ["Paranoia", "Toon", "Munchkin RPG"]
      }
    ]
  },
  {
    id: "anthropomorphic",
    name: "Anthropomorphic / Animal RPGs",
    description: "Animal characters and furry adventures",
    subcategories: [
      {
        id: "anthropomorphic",
        name: "Anthropomorphic Animals",
        description: "Humanoid animal characters and societies",
        examples: ["Ironclaw", "Mouse Guard", "Bunnies & Burrows"]
      }
    ]
  },
  {
    id: "children-family",
    name: "Children's / Family-Friendly RPGs",
    description: "Age-appropriate games for younger players",
    subcategories: [
      {
        id: "family-friendly",
        name: "Family-Friendly",
        description: "Suitable for all ages with positive themes",
        examples: ["Hero Kids", "Amazing Tales", "No Thank You Evil!"]
      }
    ]
  }
];

export function getAllCategories(): MainCategory[] {
  return RPG_CATEGORIES;
}

export function getCategoryById(id: string): MainCategory | undefined {
  return RPG_CATEGORIES.find(cat => cat.id === id);
}

export function getSubcategoryById(categoryId: string, subcategoryId: string): SubCategory | undefined {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
}

export function flattenAllSubcategories(): Array<SubCategory & { categoryId: string; categoryName: string }> {
  return RPG_CATEGORIES.flatMap(category => 
    category.subcategories.map(subcategory => ({
      ...subcategory,
      categoryId: category.id,
      categoryName: category.name
    }))
  );
}