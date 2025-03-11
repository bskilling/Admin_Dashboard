// const BACKEND_URL = "https://backendbskilling-production-20ff.up.railway.app";
const BACKEND_URL = process.env.NEXT_PUBLIC_TRAINING_BASE_URL;
const REACT_APP_SECRET_KEY = process.env.NEXT_PUBLIC_REACT_APP_SECRET_KEY;
const TRAINING_BASE_URL = process.env.NEXT_PUBLIC_TRAINING_BASE_URL;

const env = {
  BACKEND_URL,
  REACT_APP_SECRET_KEY,
  TRAINING_BASE_URL,
};

export default env;
