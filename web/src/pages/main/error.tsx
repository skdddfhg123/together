import { useRouteError } from 'react-router-dom';

interface RouteError extends Error {
  status?: number;
  statusText?: string;
  // message?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isRouteError(error: any): error is RouteError {
  // return error && typeof error.message === 'string';
  return error && typeof error.statusText === 'string';
}

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div style={{ textAlign: 'center' }} id="error-page">
      <h3>잘못된 접근입니다 !</h3>
      <p>
        <h1 style={{ textAlign: 'center', padding: '3rem' }}>
          {isRouteError(error)
            ? error.message || error.statusText
            : `Wrong Route, but Unknown Error`}
        </h1>
      </p>
    </div>
  );
}
