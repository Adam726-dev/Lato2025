// src/data/sections.ts

export interface SampleMenu {
  śniadanie: string;
  obiad: string;
  podwieczorek: string;
  kolacja: string;
}

export interface Option {
  id: number;
  name: string;
  description: string;
  price: string;
  kcal?: number;
  features: string[];
  rating: number;
  sampleMenu?: SampleMenu;
}

export interface Section {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  options: Option[];
}

export const sectionsData: Section[] = [
  {
    id: "dieta",
    name: "Dieta",
    icon: "🥗",
    color: "bg-green-400",
    description: "Zdrowe i smaczne posiłki",
    options: [
      {
        id: 1,
        name: "BeachBody Catering",
        description: "Dieta dopasowana do aktywnego trybu życia",
        price: "45 zł/dzień",
        kcal: 1800,
        features: ["Dostawa codziennie", "3 posiłki + przekąska", "Bez glutenu"],
        rating: 4.8,
        sampleMenu: {
          śniadanie: "Owsianka z owocami i orzechami",
          obiad: "Kurczak grillowany z kaszą i warzywami",
          podwieczorek: "Jogurt naturalny z granolą",
          kolacja: "Sałatka z tuńczykiem i jajkiem"
        }
      },
      {
        id: 2,
        name: "Summer Fresh",
        description: "Lekkie posiłki pełne świeżych skłdników",
        price: "38 zł/dzień",
        kcal: 1500,
        features: ["Warzywne opcje", "Lokalne składniki"],
        rating: 4.6,
        sampleMenu: {
          śniadanie: "Smoothie bowl z owocami sezonowymi",
          obiad: "Sałatka z grillowanym kurczakiem i awokado",
          podwieczorek: "Chia pudding z mlekiem kokosowym",
          kolacja: "Zupa krem z pomidorów z bazylią"
        }
      },
      {
        id: 3,
        name: "FitMeals Pro",
        description: "Sportowa dieta dla maksymalnych rezultatów",
        price: "52 zł/dzień",
        kcal: 2200,
        features: ["Wysoki protein", "Suplementy", "5 posiłków"],
        rating: 4.9,
        sampleMenu: {
          śniadanie: "Omlet z warzywami i serem feta",
          obiad: "Wołowina stir-fry z brokułami i ryżem",
          podwieczorek: "Białkowy shake z bananem",
          kolacja: "Pieczony łosoś z quinoa i szparagami"
        }
      },
      {
        id: 4,
        name: "Mediterranean Style",
        description: "Klasyczna dieta śródziemnomorska",
        price: "42 zł/dzień",
        kcal: 1900,
        features: ["Zdrowe tłuszcze", "Ryby 3× w tygodniu", "Oliwa z oliwek"],
        rating: 4.7,
        sampleMenu: {
          śniadanie: "Tosty z awokado i jajkiem w koszulce",
          obiad: "Sałatka grecka z fetą i oliwkami",
          podwieczorek: "Hummus z warzywami",
          kolacja: "Pstrąg pieczony z migdałami i warzywami"
        }
      },
      {
        id: 5,
        name: "Vege Power",
        description: "Wegańska dieta bogata w białko",
        price: "40 zł/dzień",
        kcal: 1700,
        features: ["100% roślinna", "Wysoka zawartość białka", "Bez laktozy"],
        rating: 4.5,
        sampleMenu: {
          śniadanie: "Tofu scramble z warzywami",
          obiad: "Burgery z ciecierzycy z sałatką coleslaw",
          podwieczorek: "Energetyczne kulki daktylowe",
          kolacja: "Stir-fry z tempehem i brokułami"
        }
      },
      {
        id: 6,
        name: "Low Carb Fit",
        description: "Dieta niskowęglowodanowa dla redukcji",
        price: "44 zł/dzień",
        kcal: 1600,
        features: ["Niska zawartość węglowodanów", "Wysoka zawartość tłuszczu"],
        rating: 4.4,
        sampleMenu: {
          śniadanie: "Jajka sadzone na boczku z awokado",
          obiad: "Sałatka z tuńczykiem, jajkiem i majonezem",
          podwieczorek: "Ser mozzarella z pomidorami",
          kolacja: "Kurczak pieczony z ziołami i warzywami"
        }
      },
      {
        id: 7,
        name: "Keto Master",
        description: "Dieta ketogeniczna dla zaawansowanych",
        price: "50 zł/dzień",
        kcal: 2000,
        features: ["Keto posiłki", "Bez cukru", "Wysoki tłuszcz"],
        rating: 4.6,
        sampleMenu: {
          śniadanie: "Omlet z boczkiem i serem cheddar",
          obiad: "Stek wołowy z masłem czosnkowym i sałatą",
          podwieczorek: "Orzechy włoskie i ser pleśniowy",
          kolacja: "Łosoś w sosie śmietanowym z kaparami"
        }
      },
      {
        id: 8,
        name: "Gluten Free Life",
        description: "Dieta bezglutenowa dla wrażliwych",
        price: "43 zł/dzień",
        kcal: 1800,
        features: ["Bez glutenu", "Zbilansowane składniki"],
        rating: 4.3,
        sampleMenu: {
          śniadanie: "Płatki kukurydziane z mlekiem i owocami",
          obiad: "Kurczak w sosie pomidorowym z ryżem",
          podwieczorek: "Galaretka owocowa z bitą śmietaną",
          kolacja: "Sałatka z grillowanym serem halloumi"
        }
      },
      {
        id: 9,
        name: "Klasyka Polska",
        description: "Tradycyjne polskie smaki w zdrowej wersji",
        price: "39 zł/dzień",
        kcal: 1850,
        features: ["Tradycyjne dania", "Zdrowe zamienniki"],
        rating: 4.2,
        sampleMenu: {
          śniadanie: "Jajecznica z pomidorami i szczypiorkiem",
          obiad: "Pierś z kurczaka po polsku z ziemniakami",
          podwieczorek: "Sernik na zimno z owocami",
          kolacja: "Zupa ogórkowa z koperkiem"
        }
      }
    ]
  },
  {
    id: "silownia",
    name: "Siłownia",
    icon: "🏋️‍♀️",
    color: "bg-summer-coral",
    description: "Najlepsze kluby fitness",
    options: [
      {
        id: 1,
        name: "GymMax Premium",
        description: "Największa sieć fitness z pełnym wyposażeniem",
        price: "159 zł/miesiąc",
        rating: 4.5,
        features: ["24/7 dostęp", "Trener personalny", "Basen", "Sauna", "Zajęcia grupowe"],
      },
  
      {
        id: 2,
        name: "PowerZone Gym",
        description: "Siłownia dla prawdziwych twardzieli",
        price: "89 zł/miesiąc",
        rating: 4.8,
        features: ["Free weights", "CrossFit box", "Bez tłoku", "Atmosfera hardcore"]
      },
      {
        id: 3,
        name: "YogaFit Studio",
        description: "Połączenie jogi, pilates i fitness",
        price: "129 zł/miesiąc",
        rating: 4.7,
        features: ["Joga codziennie", "Pilates", "Medytacja", "Małe grupy", "Przyjazna atmosfera"]
      },  
      {
        id: 4,
        name: "AquaFit Center",
        description: "Trening w wodzie i nie tylko",
        price: "149 zł/miesiąc",
        rating: 4.6,
        features: ["Aqua aerobik", "Pływalnia", "Jacuzzi", "Zajęcia w wodzie", "Rehabilitacja"]
      },
      {
        id: 5,
        name: "FitLife Club",
        description: "Nowoczesny klub fitness z innowacyjnym sprzętem",
        price: "99 zł/miesiąc",
        rating: 4.4,
        features: ["Trening personalny", "Strefa spinning", "Kettlebells i TRX", "Małe grupy"]
      },
      {
        id: 6,
        name: "IronWorks Gym",
        description: "Mekka wolnych ciężarów i siły",
        price: "119 zł/miesiąc",
        rating: 4.3,
        features: ["Strefa free weights", "Power racks", "Ławki olimpijskie", "Surowa atmosfera"]
      },
      {
        id: 7,
        name: "UrbanFit Studio",
        description: "Trening funkcjonalny w miejskim stylu",
        price: "109 zł/miesiąc",
        rating: 4.2,
        features: ["TRX", "Kettlebells", "Box jumps", "Stretching po zajęciach"]
      },
      {
        id: 8,
        name: "PulseFit Center",
        description: "Cardio, siła i trener grupowy",
        price: "139 zł/miesiąc",
        rating: 4.6,
        features: ["Strefa cardio", "Maszyny TechnoGym", "Zajęcia grupowe", "Monitoring tętna"]
      },
      {
        id: 9,
        name: "ZenFit Retreat",
        description: "Połączenie treningu z relaksem",
        price: "149 zł/miesiąc",
        rating: 4.5,
        features: ["Joga", "Medytacja", "Saunarium", "Masaże"]
      }
    ]
  },
  {
    id: "imprezy",
    name: "Imprezy",
    icon: "🎉",
    color: "bg-summer-purple",
    description: "Najgorętsze eventy tego lata",
    options: [
      {
        id: 1,
        name: "Open Fest Music",
        description: "Trzydniowy festival muzyczny pod gwiazdami",
        price: "299 zł/bilet",
        rating: 4.9,
        features: ["20+ artystów", "Camping", "Food trucki", "3 dni muzyki", "Strefa chillout"]
      },
      {
        id: 2,
        name: "Beach Party Series",
        description: "Cotygodniowe imprezy na plaży",
        price: "45 zł/wydarzenie",
        rating: 4.7,
        features: ["DJ sets", "Koktajle", "Zachód słońca", "Dancing on sand", "Bonfire"]
      },
      {
        id: 3,
        name: "Rooftop Nights",
        description: "Ekskluzywne imprezy na dachach miasta",
        price: "89 zł/wieczór",
        rating: 4.8,
        features: ["Premium drinki", "View na miasto", "Dress code", "Live DJ", "VIP area"]
      },
      {
        id: 4,
        name: "Festival Smaków",
        description: "Kulinarny festiwal z muzyką na żywo",
        price: "65 zł/dzień",
        rating: 4.6,
        features: ["Local food", "Wine tasting", "Warsztaty gotowania", "Acoustic stage", "Family friendly"]
      },
      {
        id: 6,
        name: "Retro Disco Party",
        description: "Najlepsze hity lat 70. i 80. w rytmie disco",
        price: "49 zł/wydarzenie",
        rating: 4.4,
        features: ["DJ z płyt winylowych", "Konkurs na najlepszy strój", "Klimatyczne światła"]
      },
      {
        id: 7,
        name: "Silent Cinema Night",
        description: "Pokaz filmowy pod gwiazdami – słuchawki w cenie",
        price: "59 zł/bilet",
        rating: 4.5,
        features: ["5 kultowych filmów", "Dźwięk na słuchawkach", "Snack bar"]
      },
      {
        id: 8,
        name: "Open-Air Jazz Evening",
        description: "Romantyczny wieczór z jazzowymi standardami",
        price: "89 zł/bilet",
        rating: 4.7,
        features: ["Na żywo: 5-osobowy zespół", "Strefa lounge", "Degustacja win"]
      },
      {
        id: 9,
        name: "Food Truck Fiesta",
        description: "Najlepsze food trucki i street food w jednym miejscu",
        price: "Wejście free",
        rating: 4.9,
        features: ["20 food trucków", "Strefa dziecięca", "Muzyka na żywo"]
      },
      {
        id: 10,
        name: "Neon Rave Party",
        description: "Impreza w stylu rave z UV i laserami",
        price: "79 zł/wydarzenie",
        rating: 4.3,
        features: ["UV painting", "Laser show", "After till dawn"]
      }
    ]
  },
  {
    id: "wakacje",
    name: "Wakacje",
    icon: "✈️",
    color: "bg-summer-yellow",
    description: "Niezapomniane podróże i wypady",
    options: [
      {
        id: 1,
        name: "Greckie Wyspy",
        description: "Magiczna Santorini i Mykonos w jednej podróży",
        price: "2599 zł/osoba",
        rating: 4.9,
        features: ["7 dni", "All inclusive", "Loty w cenie", "Hotel 4*", "Zwiedzanie"]
      },
      {
        id: 2,
        name: "Bałtycki Roadtrip",
        description: "Odkryj piękno polskiego wybrzeża",
        price: "899 zł/osoba",
        rating: 4.5,
        features: ["5 dni", "Gdańsk-Sopot-Hel", "Nocleg w pensjonatach", "Przewodnik", "Transport"]
      },
      {
        id: 3,
        name: "Tatrzańska Przygoda",
        description: "Górskie szlaki i relaks w spa",
        price: "1299 zł/osoba",
        rating: 4.7,
        features: ["4 dni", "Hotel górski", "Przewodnik górski", "SPA included", "Wyżywienie"]
      },
      {
        id: 4,
        name: "Włoskie Wybrzeże",
        description: "Amalfi Coast – raj na ziemi",
        price: "3299 zł/osoba",
        rating: 4.8,
        features: ["8 dni", "Boutique hotel", "Loty", "Transfery", "Degustacje win"]
      },
      {
        id: 5,
        name: "Islandzkie Krajobrazy",
        description: "Gejzery, wulkany i zorza polarna",
        price: "2199 zł/osoba",
        rating: 4.6,
        features: ["6 dni", "All inclusive", "Basen termalny", "Przewodnik", "Zorza polarna"]
      },
      {
        id: 6,
        name: "Hiszpańska Fiesta",
        description: "Tapas, flamenco i plaże Costa Brava",
        price: "1799 zł/osoba",
        rating: 4.7,
        features: ["5 dni", "All inclusive", "Przewodnik", "Wieczorne wyjścia", "Plaże"]
      },
      {
        id: 7,
        name: "Safari w Afryce",
        description: "Spotkania z dziką przyrodą na Serengeti",
        price: "4599 zł/osoba",
        rating: 4.9,
        features: ["7 dni", "Safari 4×4", "Noclegi w lodge", "Local guide", "All inclusive"]
      },
      {
        id: 8,
        name: "Weneckie Rejsy",
        description: "Romantyczny tydzień na kanałach Wenecji",
        price: "2499 zł/osoba",
        rating: 4.5,
        features: ["7 dni", "Rejs gondolą", "Hotel 4*", "Zwiedzanie", "Kolacje na wodzie"]
      }
    ]
  }
];
