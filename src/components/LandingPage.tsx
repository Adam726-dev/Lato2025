
import React, { useState } from 'react';
import { ChevronRight, Star, Users, Target, Zap, ChevronDown, Smartphone, Download } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    {
      icon: <Target className="h-6 w-6 text-summer-coral" />,
      title: "Spersonalizowane Plany",
      description: "AI stworzy dla Ciebie idealny plan diety, treningu i wypoczynku dopasowany do Twoich celów"
    },
    {
      icon: <Zap className="h-6 w-6 text-summer-blue" />,
      title: "Błyskawiczna Konfiguracja",
      description: "Wystarczy kilka minut, żeby otrzymać kompletny plan na całe lato"
    },
    {
      icon: <Users className="h-6 w-6 text-summer-mint" />,
      title: "Społeczność",
      description: "Dołącz do tysięcy osób, które już osiągnęły swoje letnie cele"
    }
  ];

  const testimonials = [
    {
      name: "Anna K.",
      text: "Dzięki tej aplikacji schudłam 8kg przed wakacjami! Plan był idealnie dopasowany do mojego stylu życia.",
      rating: 5
    },
    {
      name: "Michał P.",
      text: "Najlepsza inwestycja w siebie. AI zaproponował mi trening i dietę, które rzeczywiście działają.",
      rating: 5
    },
    {
      name: "Kasia W.",
      text: "Wreszcie znalazłam aplikację, która łączy wszystko w jednym miejscu. Polecam każdemu!",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "Czy aplikacja jest darmowa?",
      answer: "Tak! Nasza aplikacja jest całkowicie darmowa. Wszystkie funkcje - kalkulator BMR, generator planów AI, plany treningowe i dietetyczne - są dostępne bez opłat. Nie ma ukrytych kosztów ani subskrypcji."
    },
    {
      question: "Jak zainstalować aplikację na telefonie?",
      answer: (
        <div>
          <p className="mb-2">To aplikacja PWA (Progressive Web App), którą możesz zainstalować jak zwykłą aplikację:</p>
          <div className="space-y-1 text-sm">
            <p><strong>📱 Android:</strong> Otwórz w Chrome → Menu (3 kropki) → "Dodaj do ekranu głównego"</p>
            <p><strong>🍎 iPhone:</strong> Otwórz w Safari → Przycisk "Udostępnij" → "Dodaj do ekranu głównego"</p>
            <p>Po instalacji będzie działać jak normalna aplikacja, nawet offline!</p>
          </div>
        </div>
      )
    },
    {
      question: "Czy moje dane są bezpieczne?",
      answer: "Absolutnie! Wszystkie dane są szyfrowane i przechowywane w bezpiecznej bazie danych Firebase. Nie udostępniamy Twoich danych osobowych stronom trzecim. Możesz w każdej chwili usunąć swoje konto i wszystkie dane."
    },
    {
      question: "Czy aplikacja działa offline?",
      answer: "Tak! Po zainstalowaniu jako PWA aplikacja będzie działać offline. Możesz przeglądać swoje plany, śledzić postępy i korzystać z kalkulatora BMR nawet bez internetu. Dane zsynchronizują się automatycznie po powrocie połączenia."
    },
    {
      question: "Jak dokładny jest generator planów AI?",
      answer: "Nasz AI został wytrenowany na bazie tysięcy planów fitness i żywieniowych. Uwzględnia Twój wiek, wagę, cel, preferencje żywieniowe i dostępny czas. Plany są tworzone według sprawdzonych zasad dietetycznych i treningowych, ale zawsze warto skonsultować się z lekarzem przed rozpoczęciem nowej diety."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-mint-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">☀️</span>
              <span className="font-bold text-xl text-gray-900">Twój Plan na Lato</span>
            </div>
            <button
              onClick={onGetStarted}
              className="bg-summer-blue hover:bg-summer-blue/90 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Zaloguj się
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Najlepsze <span className="text-summer-blue">Lato</span> w Życiu ☀️
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Stwórz swój idealny plan na lato w 5 minut. AI pomoże Ci wybrać dietę, trening, 
              rozrywkę i wakacje dopasowane idealnie do Ciebie.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-summer-coral to-summer-blue hover:from-summer-coral/90 hover:to-summer-blue/90 text-white text-xl px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                Rozpocznij za darmo
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-8 text-gray-600">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>10,000+ użytkowników</span>
              </div>
              <div className="flex items-center">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span>4.9/5 ocena</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Dlaczego wybierają nas tysiące osób?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nasza platforma łączy najnowsze technologie AI z praktyczną wiedzą ekspertów
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors animate-scale-in">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white rounded-full shadow-md">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-summer-blue to-summer-mint">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Co mówią nasi użytkownicy?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-gray-900">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Najczęściej zadawane pytania
            </h2>
            <p className="text-xl text-gray-600">
              Odpowiedzi na wszystko, co chcesz wiedzieć o aplikacji
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 py-4 bg-white border-t border-gray-200">
                    <div className="text-gray-700">
                      {typeof faq.answer === 'string' ? faq.answer : faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Gotowy na transformację?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Dołącz do tysięcy osób, które już zmieniły swoje życie dzięki naszej platformie
          </p>
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-summer-coral to-summer-blue hover:from-summer-coral/90 hover:to-summer-blue/90 text-white text-xl px-12 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            Zacznij już dziś - za darmo! 🚀
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl">☀️</span>
            <span className="font-bold text-lg text-white">Twój Plan na Lato</span>
          </div>
          <p className="text-gray-400">© 2025 Twój Plan na Lato. Wszystkie prawa zastrzeżone.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
