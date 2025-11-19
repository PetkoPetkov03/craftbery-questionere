import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Link, useLocation, useNavigate } from "react-router";
import DOMPurify from "dompurify";
import { filterProcutsByAnswers } from "~/utils/filter";
import type { Questions } from "~/types/questions";
import Container from "~/assets/components/Container";
import "./routine.css";
import SliderButton from "~/assets/components/SliderButton";
import PageIndex from "~/assets/components/PageIndex";

interface LocationState {
  answers: { [id: number]: string };
  questions: Questions;
}

type Product = {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  published_at: Date;
  created_at: Date;
};

const fetchProducts = async (): Promise<any[]> => {
  const request = await fetch(
    "https://jeval.com.au/collections/hair-care/products.json?page=1"
  );

  const response = await request.json();

  return response.products;
};

const answerToTagsMapping = {
  "What's your hair type or texture?": {
    Straight: ["Smoothing", "Anti-Frizz", "Straight Hair"],
    Curly: ["Curly Hair", "Curl Enhancers", "Curl Definition"],
    Wavy: ["Curl Enhancers", "Wave Definition", "Textured Hair"],
    Fine: ["Fine", "Volume", "Lightweight", "Benefits_Volume"],
  },
  "How often do you wash your hair?": {
    Daily: ["Gentle", "Daily Use", "Haircare"],
    "Every other day": ["Haircare", "Shampoo"],
    "Twice a week": ["Treatments", "Deep Conditioning"],
    "Once a week": ["Treatments", "Self-Care", "Intensive"],
    "Once every two weeks": ["Treatments", "Deep Conditioning", "Repairing"],
  },
  "What benefit do you look for in your hair products?": {
    "Anti-breakage": ["Benefits_Repairing", "Strengthening", "Anti-Breakage"],
    Hydration: ["Benefits_Moisturising", "Hydration", "Moisturizing"],
    "Soothing dry scalp": ["Scalp Care", "Soothing", "Anti-inflammatory"],
    "Repairs the appearance of damaged hair": [
      "Benefits_Repairing",
      "Treatments",
      "Damage Repair",
    ],
    Volume: ["Benefits_Volume", "Volume", "Body"],
    "Curl and coil enhancing.": [
      "Curl Enhancers",
      "Curly Hair",
      "Curl Definition",
    ],
  },
  "Is there anything troubling you about your hair?": {
    Breakage: ["Benefits_Repairing", "Strengthening", "Anti-Breakage"],
    Frizz: ["Benefits_Anti-Frizz", "Smoothing", "Frizz Control"],
    "Scalp dryness": ["Scalp Care", "Moisturising", "Hydration"],
    Damage: ["Benefits_Repairing", "Treatments", "Damage Repair"],
    Tangling: ["Detanglers", "Leave-In Conditioner", "Smoothing"],
  },
  "What is your natural hair color(s) today?": {
    Black: ["All Hair Types", "Color Care"],
    Brown: ["All Hair Types", "Color Care"],
    Blonde: ["Blonde", "Toning", "Benefits_Toning", "Color Maintenance"],
    "Red/Orange": ["Color Care", "Color Maintenance"],
    "Silver/Grey": ["Grey Hair", "Toning", "Benefits_Toning"],
  },
};

const fetchAndFilter = async (
  state: LocationState,
  setProducts: Dispatch<SetStateAction<any[]>>
) => {
  const result = await fetchProducts();

  console.log(`pre func ${result}`);

  if (state && state.answers && state.questions) {
    const filteredProducts = filterProcutsByAnswers(
      result,
      state.answers,
      state.questions,
      answerToTagsMapping
    );

    setProducts(filteredProducts);
  } else {
    setProducts(result);
  }
};

export enum Action {
  FORWARD,
  BACK,
}

export interface SliderController {
  action: Action;
  productIndex: number;
  productSetState: Dispatch<SetStateAction<number>>;
  productLength: number;
}

const sliderControl = ({
  action,
  productIndex,
  productSetState,
  productLength,
}: SliderController) => {
  if (action == Action.FORWARD) {
    productSetState((productIndex + 3) % productLength);
  } else {
    productSetState((productIndex - 3) % productLength);
  }
};

const getSliderItems = (products: any[], index: number, count: number = 3) => {
  const result = [];

  const len = products.length;

  for (let i = 0; i < count; i++) {
    result.push(products[(index + i) % len]);
  }

  return result;
};

type Pair = {
  x: number;
  y: number;
};

const getPage = (products: any[], productDisplayIndex: number): Pair => {
  const currPage = Math.floor(productDisplayIndex / 3) + 1;
  const finalPage = Math.ceil(products.length / 3);

  const pair: Pair = { x: currPage, y: finalPage };

  return pair;
};

const toggleFavorite = (id: number, setFavoriteIds: Dispatch<SetStateAction<number[]>>) => {
  setFavoriteIds(prev => {
    let updated = [...prev];

    if (updated.includes(id)) {
      updated = updated.filter(x => x !== id);
    } else {
      updated.push(id);
    }

    localStorage.setItem("favorite-items", JSON.stringify(updated));
    return updated;
  });
};


const isFavorite = (id: number) => {
  const resultString = localStorage.getItem("favorite-items");
  let items: number[] = [];

  if (resultString) {
    items = JSON.parse(resultString);
  }

  return items.includes(id);
};

const Routine = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [sliderProducts, setSliderProducts] = useState<any[]>([]);
  const [currPage, setCurrentPage] = useState<number>(0);
  const [maxPage, setMaxPage] = useState<number>(0);
  const [productDisplayIndex, setProductDisplayIndex] = useState<number>(1);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const location = useLocation();

  const navigate = useNavigate();

  const state = location.state as LocationState | undefined;

  useEffect(() => {
    if (!state || !state.answers || Object.keys(state.answers).length === 0) {
      navigate("/");
    }
  }, [state, navigate]);

  useEffect(() => {
    (async () => {
      try {
        if (!state) return;
        await fetchAndFilter(state, setProducts);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error(error);
        }
      }

      const resultString = localStorage.getItem("favorite-items");
      if (resultString) {
        setFavoriteIds(JSON.parse(resultString));
      }
    })();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    console.log(`HASHDAD ${products}`);

    setSliderProducts(getSliderItems(products, productDisplayIndex));
    const pages = getPage(products, productDisplayIndex);

    setCurrentPage(pages.x);
    setMaxPage(pages.y);
  }, [products, productDisplayIndex]);

  useEffect(() => {
  if (products.length === 0) return;

  const sorted = [...products].sort((a, b) => {
    const aFav = favoriteIds.includes(a.id);
    const bFav = favoriteIds.includes(b.id);
    return (aFav === bFav) ? 0 : aFav ? -1 : 1;
  });

  setSliderProducts(getSliderItems(sorted, productDisplayIndex));

  const pages = getPage(sorted, productDisplayIndex);
  setCurrentPage(pages.x);
  setMaxPage(pages.y);
}, [products, productDisplayIndex, favoriteIds]);

  if (!state || !state.answers) {
    return null;
  }

  return (
    <Container>
      <div className="board">
        <h1>Build you everyday self care routine.</h1>
        <p>
          Perfect for if you're looking for soft, nourished skin, our
          moisturizing body washes are made with skin-natural nutrients that
          work with your skin to replenish moisture. With a light formula, the
          bubbly lather leaves your skin feeling cleansed and cared for. And by
          choosing relaxing fragrances you can add a moment of calm to the end
          of your day.
        </p>

        <button
          className="retake-quiz-button"
          onClick={() => window.location.replace("/quiz?question=1")}
        >
          Retake the quiz
        </button>
      </div>
      <div className="product-container">
        <div className="product-slider">
          {currPage === 1 ? null : (
            <SliderButton
              t={Action.BACK}
              control={() =>
                sliderControl({
                  action: Action.BACK,
                  productIndex: productDisplayIndex,
                  productSetState: setProductDisplayIndex,
                  productLength: products.length,
                })
              }
            />
          )}
          {sliderProducts.map((product) => {
            return (
              <div
                className="product-display"
                key={product.id}
              >
                <div style={{
                  backgroundImage: `url(${product.images[0].src})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "top",
                }} className="product-image" />
                <svg
                  onClick={() => toggleFavorite(product.id,setFavoriteIds)}
                  className="favorite"
                  width="20"
                  height="19"
                  viewBox="0 0 20 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 18.35L8.55 17.05C6.86667 15.5333 5.475 14.225 4.375 13.125C3.275 12.025 2.4 11.0375 1.75 10.1625C1.1 9.2875 0.645833 8.48333 0.3875 7.75C0.129167 7.01667 0 6.26667 0 5.5C0 3.93333 0.525 2.625 1.575 1.575C2.625 0.525 3.93333 0 5.5 0C6.36667 0 7.19167 0.183333 7.975 0.55C8.75833 0.916667 9.43333 1.43333 10 2.1C10.5667 1.43333 11.2417 0.916667 12.025 0.55C12.8083 0.183333 13.6333 0 14.5 0C16.0667 0 17.375 0.525 18.425 1.575C19.475 2.625 20 3.93333 20 5.5C20 6.26667 19.8708 7.01667 19.6125 7.75C19.3542 8.48333 18.9 9.2875 18.25 10.1625C17.6 11.0375 16.725 12.025 15.625 13.125C14.525 14.225 13.1333 15.5333 11.45 17.05L10 18.35ZM10 15.65C11.6 14.2167 12.9167 12.9875 13.95 11.9625C14.9833 10.9375 15.8 10.0458 16.4 9.2875C17 8.52917 17.4167 7.85417 17.65 7.2625C17.8833 6.67083 18 6.08333 18 5.5C18 4.5 17.6667 3.66667 17 3C16.3333 2.33333 15.5 2 14.5 2C13.7167 2 12.9917 2.22083 12.325 2.6625C11.6583 3.10417 11.2 3.66667 10.95 4.35H9.05C8.8 3.66667 8.34167 3.10417 7.675 2.6625C7.00833 2.22083 6.28333 2 5.5 2C4.5 2 3.66667 2.33333 3 3C2.33333 3.66667 2 4.5 2 5.5C2 6.08333 2.11667 6.67083 2.35 7.2625C2.58333 7.85417 3 8.52917 3.6 9.2875C4.2 10.0458 5.01667 10.9375 6.05 11.9625C7.08333 12.9875 8.4 14.2167 10 15.65Z"
                    fill={!isFavorite(product.id) ? "#1C2635" : "#FF69B4"}
                  />
                </svg>

                <div className="product-display-module">
                  <h1 className="product-display-title">{product.title}</h1>
                  <p className="product-display-price">
                    ${product.variants[0].price}
                  </p>
                </div>
              </div>
            );
          })}
          {currPage === maxPage ? null : (
            <SliderButton
              t={Action.FORWARD}
              control={() =>
                sliderControl({
                  action: Action.FORWARD,
                  productIndex: productDisplayIndex,
                  productSetState: setProductDisplayIndex,
                  productLength: products.length,
                })
              }
            />
          )}
        </div>
        <PageIndex pages={maxPage} currPage={currPage} />
      </div>
    </Container>
  );
};

export default Routine;
