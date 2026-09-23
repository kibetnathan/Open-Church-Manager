import React, { useEffect } from 'react';

function PageNotFound() {
  useEffect(() => {
    document.title = '404 Not Found';
    return () => {
      document.title = 'OCM';
    };
  }, []);

  return (
    <>
      <div className="flex flex-col w-full min-h-screen justify-center items-center bg-amber-50">
        <div className="relative bg-porcelain border border-divider rounded-sm p-12 w-96 text-center shadow-md overflow-hidden">
          <div className='absolute -top-8 -right-6 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none' ></div>
          <div className="w-12 h-px bg-amber-500 mx-auto mb-8" />

          <h1 className="font-cormorant text-8xl font-light text-amber-500 leading-none mb-2">
            404
          </h1>

          <p className="font-cormorant text-xs tracking-widest uppercase text-secondary mb-8">
            Page Not Found
          </p>


          <p className="font-coptic text-secondary leading-relaxed mb-10">
            The page you are looking for does not exist or has been moved.
          </p>

          <a
            href="/"
            className="inline-block font-coptic text-xs tracking-[0.4em] uppercase bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 transition-colors duration-200"
          >
            Return Home
          </a>

          <div className="w-12 h-px bg-amber-600 mx-auto mt-8" />
        </div>
      </div>
    </>
  );
}

export default PageNotFound;