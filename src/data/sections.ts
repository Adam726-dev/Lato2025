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
  sampleMenu?: SampleMenu; // <- zmiana tutaj!
  image?: string;
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
        price: "45",
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
        description: "Lekkie posiłki pełne świeżych składników",
        price: "38",
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
        price: "52",
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
        price: "42",
        kcal: 1900,
        features: ["Zdrowe tłuszcze", "Ryby 3x w tygodniu", "Oliwa z oliwek"],
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
        price: "40",
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
        price: "44",
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
        price: "50",
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
        price: "43",
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
        price: "39",
        kcal: 1850,
        features: ["Tradycyjne dania", "Zdrowe zamienniki"],
        rating: 4.2,
        sampleMenu: {
          śniadanie: "Jajecznica z pomidorami i szczypiorkiem",
          obiad: "Pierś z kurczaka po polsku z ziemniakami",
          podwieczorek: "Sernik na zimno z owocami",
          kolacja: "Zupa ogórkowa z koperkiem"
        }
      },
      
    ],
  },
  {
    id: 'silownia',
    name: 'Siłownia',
    icon: '🏋️‍♀️',
    color: 'bg-summer-coral',
    description: 'Najlepsze kluby fitness',
    options: [
      {
        id: 1,
        name: 'GymMax Premium',
        description: 'Największa sieć fitness z pełnym wyposażeniem',
        price: '159 zł/miesiąc',
        rating: 4.5,
        image: '🏢',
        features: ['24/7 dostęp', 'Trener personalny', 'Basen', 'Sauna', 'Zajęcia grupowe']
      },
      {
        id: 2,
        name: 'PowerZone Gym',
        description: 'Siłownia dla prawdziwych twardzieli',
        price: '89 zł/miesiąc',
        rating: 4.8,
        image: '⚡',
        features: ['Free weights', 'CrossFit box', 'Bez tłoku', 'Atmosfera hardcore']
      },
      {
        id: 3,
        name: 'YogaFit Studio',
        description: 'Połączenie jogi, pilates i fitness',
        price: '129 zł/miesiąc',
        rating: 4.7,
        image: '🧘‍♀️',
        features: ['Joga codziennie', 'Pilates', 'Medytacja', 'Małe grupy', 'Przyjazna atmosfera']
      },
      {
        id: 4,
        name: 'AquaFit Center',
        description: 'Trening w wodzie i nie tylko',
        price: '149 zł/miesiąc',
        rating: 4.6,
        image: '🏊‍♀️',
        features: ['Aqua aerobik', 'Pływalnia', 'Jacuzzi', 'Zajęcia w wodzie', 'Rehabilitacja']
      }
    ]
  },
  {
    id: 'imprezy',
    name: 'Imprezy',
    icon: '🎉',
    color: 'bg-summer-purple',
    description: 'Najgorętsze eventy tego lata',
    options: [
      {
        id: 1,
        name: 'Open Fest Music',
        description: 'Trzydniowy festival muzyczny pod gwiazdami',
        price: '299 zł/bilet',
        rating: 4.9,
        image: '🎪',
        features: ['20+ artystów', 'Camping', 'Food trucki', '3 dni muzyki', 'Strefa chillout']
      },
      {
        id: 2,
        name: 'Beach Party Series',
        description: 'Cotygodniowe imprezy na plaży',
        price: '45 zł/wydarzenie',
        rating: 4.7,
        image: '🏖️',
        features: ['DJ sets', 'Koktajle', 'Zachód słońca', 'Dancing on sand', 'Bonfire']
      },
      {
        id: 3,
        name: 'Rooftop Nights',
        description: 'Ekskluzywne imprezy na dachach miasta',
        price: '89 zł/wieczór',
        rating: 4.8,
        image: '🌃',
        features: ['Premium drinki', 'View na miasto', 'Dress code', 'Live DJ', 'VIP area']
      },
      {
        id: 4,
        name: 'Festival Smaków',
        description: 'Kulinarny festiwal z muzyką na żywo',
        price: '65 zł/dzień',
        rating: 4.6,
        image: '🍽️',
        features: ['Local food', 'Wine tasting', 'Warsztaty gotowania', 'Acoustic stage', 'Family friendly']
      }
    ]
  },
  {
    id: 'wakacje',
    name: 'Wakacje',
    icon: '✈️',
    color: 'bg-summer-yellow',
    description: 'Niezapomniane podróże i wypady',
    options: [
      {
        id: 1,
        name: 'Greckie Wyspy',
        description: 'Magiczna Santorini i Mykonos w jednej podróży',
        price: '2599 zł/osoba',
        rating: 4.9,
        image: '🇬🇷',
        features: ['7 dni', 'All inclusive', 'Loty w cenie', 'Hotel 4*', 'Zwiedzanie']
      },
      {
        id: 2,
        name: 'Bałtycki Roadtrip',
        description: 'Odkryj piękno polskiego wybrzeża',
        price: '899 zł/osoba',
        rating: 4.5,
        image: '🚗',
        features: ['5 dni', 'Gdańsk-Sopot-Hel', 'Nocleg w pensjonatach', 'Przewodnik', 'Transport']
      },
      {
        id: 3,
        name: 'Tatrzańska Przygoda',
        description: 'Górskie szlaki i relaks w spa',
        price: '1299 zł/osoba',
        rating: 4.7,
        image: '⛰️',
        features: ['4 dni', 'Hotel górski', 'Przewodnik górski', 'SPA included', 'Wyżywienie']
      },
      {
        id: 4,
        name: 'Włoskie Wybrzeże',
        description: 'Amalfi Coast - raj na ziemi',
        price: '3299 zł/osoba',
        rating: 4.8,
        image: '🇮🇹',
        features: ['8 dni', 'Boutique hotel', 'Loty', 'Transfery', 'Degustacje win']
      }
    ]
  }
];
