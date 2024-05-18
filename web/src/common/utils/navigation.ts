import { useNavigate } from 'react-router-dom';

let navigate: ReturnType<typeof useNavigate>;

export const setNavigate = (nav: ReturnType<typeof useNavigate>) => {
  navigate = nav;
};

export const navigateToSignin = () => {
  if (navigate) {
    navigate('/signin');
  } else {
    console.error('Navigate function is not set');
  }
};
