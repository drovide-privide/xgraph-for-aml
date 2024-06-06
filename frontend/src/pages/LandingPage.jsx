import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../src/assets/logo.png'; // Adjust the path based on your file structure

const LandingPage = () => {
    return (
        <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-t from-slate-50 to-indigo-200">
          <div className="text-center">
            <img src={logo} alt="Logo" className="mx-auto mb-4 h-32 w-32 max-w-full max-h-full" />
            <div className="relative mb-6">  {/* Added mb-6 for spacing */}
              <h1 
                className="text-4xl font-bold text-gray-800 inline-block"
                style={{ fontFamily: 'Raleway, sans-serif' }}
              >
                xGraph untuk AML
              </h1>
              <h2 
                className="text-xl font-medium text-[#6F9CEB] absolute -top-6 -right-24 transform"
                style={{ fontFamily: 'Raleway, sans-serif' }}
              >
                dengan <strong className="font-extrabold">Gen AI</strong>
              </h2>
            </div>
            <div>  {/* New div to ensure button is on a new line */}
              <Link to="/graph">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Go to Graph
                </button>
              </Link>
            </div>
          </div>
        </div>
      );
};

export default LandingPage;


