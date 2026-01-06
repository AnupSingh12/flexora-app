
import { useState } from "react";
import "./creativeSection.css";

export default function CreativeSection() {

  const questions = [
  {
    question: "Which fashion icon's style do you admire most?",
    answers: [
      {
        text: "Street style icons like Kanye West or Hailey Bieber.",
        vibe: "urban",
      },
      {
        text: "Classic movie stars like Audrey Hepburn or James Dean.",
        vibe: "minimalist",
      },
      {
        text: "Artists and designers like Frida Kahlo or Alexander McQueen.",
        vibe: "bold",
      },
      {
        text: "Festivalgoers and musicians with a free-spirited style.",
        vibe: "bohemian",
      },
    ],
  },
  {
    question: "What's the one accessory you can't live without?",
    answers: [
      { text: "A pair of fresh sneakers.", vibe: "urban" },
      { text: "A classic leather watch.", vibe: "minimalist" },
      { text: "Statement jewelry or a bold-colored bag.", vibe: "bold" },
      { text: "A wide-brimmed hat or a woven bracelet.", vibe: "bohemian" },
    ],
  },
  {
    question: "Your favorite outfit is for what kind of occasion?",
    answers: [
      { text: "A casual day out in the city.", vibe: "urban" },
      {
        text: "A professional meeting or a formal dinner.",
        vibe: "minimalist",
      },
      { text: "A big party or a special event.", vibe: "bold" },
      {
        text: "An outdoor festival or a relaxed get-together.",
        vibe: "bohemian",
      },
    ],
  },
  {
    question: "What's your go-to pattern or print?",
    answers: [
      { text: "Geometric or graphic designs.", vibe: "urban" },
      { text: "No patterns, solid colors only.", vibe: "minimalist" },
      { text: "Animal prints or vibrant, abstract art.", vibe: "bold" },
      { text: "Intricate floral or paisley patterns.", vibe: "bohemian" },
    ],
  },
];


const vibes = {
  urban: {
    title: "The Urban Explorer",
    description:
      "Your style is defined by comfort, function, and effortless cool. You prefer modern, relaxed silhouettes and are always on the lookout for the latest trends in streetwear.",
    products: [
      {
        name: "Oversized Graphic T-Shirt",
        image: "src/assets/photos/Body/Quiz/OversizeGraphicTShirt.png",
      },
      {
        name: "High-Top Sneakers",
        image: "src/assets/photos/Body/Quiz/HighTopSneaker.png",
      },
      {
        name: "Sporty Digital Watch",
        image: "src/assets/photos/Body/Quiz/SportyDigitalWatch.png",
      },
    ],
  },
  minimalist: {
    title: "The Timeless Minimalist",
    description:
      "You believe that less is more. Your wardrobe is built on a foundation of high-quality, versatile basics and clean lines. You're classic, elegant, and always put-together.",
    products: [
      {
        name: "Tailored Blazer",
        image: "src/assets/photos/Body/Quiz/TailoredBlazer.png",
      },
      {
        name: "Classic Leather Loafers",
        image: "src/assets/photos/Body/Quiz/ClassicLeatherLoafers.png",
      },
      {
        name: "Sleek Analog Watch",
        image: "src/assets/photos/Body/Quiz/SleekAnalogWatch.png",
      },
    ],
  },
  bold: {
    title: "The Bold Visionary",
    description:
      "You're a style trailblazer who isn't afraid to stand out. Your closet is a curated collection of vibrant colors, unique textures, and dramatic silhouettes that make a statement.",
    products: [
      {
        name: "Statement Suit or Dress",
        image: "src/assets/photos/Body/Quiz/StatementDress.png",
      },
      {
        name: "Platform Heels or Boots",
        image: "src/assets/photos/Body/Quiz/PlatformHeels.png",
      },
      {
        name: "Oversized Gilded Watch",
        image: "src/assets/photos/Body/Quiz/OversizeGraphicTShirt.png",
      },
    ],
  },
  bohemian: {
    title: "The Free Spirit",
    description:
      "Your style is a celebration of art, nature, and comfort. You love flowing fabrics, unique patterns, and a relaxed, effortless aesthetic that feels authentic and personal.",
    products: [
      {
        name: "Embroidered Maxi Dress",
        image: "src/assets/photos/Body/Quiz/EmbroideredMaxiDress.png",
      },
      {
        name: "Woven Sandals",
        image: "src/assets/photos/Body/Quiz/WovenShoes.png",
      },
      {
        name: "Vintage-Inspired Watch",
        image: "src/assets/photos/Body/Quiz/VintageWatch.png",
      },
    ],
  },
};

 
  const [screen, setScreen] = useState("start"); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [vibeScoresState, setVibeScoresState] = useState({
    urban: 0,
    minimalist: 0,
    bold: 0,
    bohemian: 0,
  });

  const startQuiz = () => {
    setVibeScoresState({ urban: 0, minimalist: 0, bold: 0, bohemian: 0 });
    setCurrentQuestionIndex(0);
    setScreen("quiz");
  };

  const handleAnswerClick = (selectedVibe) => {
    setVibeScoresState((prev) => ({
      ...prev,
      [selectedVibe]: (prev[selectedVibe] || 0) + 1,
    }));

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      setScreen("results");
    }
  };

  const getFinalVibe = () => {
    const finalVibe = Object.keys(vibeScoresState).reduce((a, b) =>
      vibeScoresState[a] > vibeScoresState[b] ? a : b
    );
    return vibes[finalVibe];
  };

  const restartQuiz = () => {
    setVibeScoresState({ urban: 0, minimalist: 0, bold: 0, bohemian: 0 });
    setCurrentQuestionIndex(0);
    setScreen("start");
  };

  const currentQuestion = questions[currentQuestionIndex];

  const finalVibeData = screen === "results" ? getFinalVibe() : null;

  return (
    <>
      <section className="creative">
        <div className="container">
          <div className="card container-for-body" id="quiz-container">
            {screen === "start" && (
              <div id="start-screen" className="space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
                  What's Your Style Vibe?
                </h1>
                <p className="text-lg text-gray-600 max-w-lg mx-auto">
                  Find the perfect clothes, shoes, and watches that match your
                  unique personality.
                </p>
                <button onClick={startQuiz} id="start-btn" className="quiz-button primary">
                  Start Quiz
                </button>
              </div>
            )}

            {screen === "quiz" && currentQuestion && (
              <div id="quiz-screen" className="space-y-8">
                <h2 id="question-text">{currentQuestion.question}</h2>
                <div id="answer-buttons" className="answer-buttons">
                  {currentQuestion.answers.map((answer, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerClick(answer.vibe)}
                      className="quiz-button secondary"
                    >
                      {answer.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {screen === "results" && finalVibeData && (
              <div id="results-screen" className="space-y-8">
                <h2>Your Vibe Is...</h2>
                <h3 id="vibe-title">{finalVibeData.title}</h3>
                <p id="vibe-description">{finalVibeData.description}</p>

                <div style={{ width: "100%" }}>
                  <h4>Curated for You:</h4>
                  <div id="quiz-product-list" className="product-g">
                    {finalVibeData.products.map((product, i) => (
                      <div className="product-c" key={i}>
                        <img src={product.image} alt={product.name} />
                        <p>{product.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={restartQuiz} id="restart-btn" className="quiz-button secondary">
                  Start Over
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}