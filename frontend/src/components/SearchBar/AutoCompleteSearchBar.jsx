// import React, { useEffect, useState } from 'react'

// //feature enhancement -> if i click outside input box so this seacrh result will be hide -> like google searchbar 
// // improve performace of this input box -> debouncing  -> when user stops typing we will make api call 
// // same result dont make another api call -> caching -> store result in local storage if perseistent or in state or for that particular session
// const AutoCompleteSearchBar = () => {
 
//     const [results,setResults]=useState([])
//     const [input,setInput]=useState('')
//     const [showResult,setShowResults]=useState(false)
//     const [cache,setCache]=useState({}) ;// key value pair-> object 


//     const fetchData=async ()=>{

//             if(cache[input]){  // if data present in my cache  then below code will not excutre directly return from this 
//                 console.log('cache returned',input)
//                 setResults(cache[input])
//                 return ;
//             }

//             console.log('api call',input)
//             const data=await fetch(`https://dummyjson.com/recipes/search?q=${input}`)
//             const json=await data.json() 
//             setResults(json?.recipes)
//             setCache(prev=>({...prev,[input]:json?.recipes}))  // append the data no replace 
//     }
        
//     useEffect(()=>{
//        //const timer=setTimeout(fetchData,3000) 
//        const timer=setTimeout(fetchData,500)

//        return ()=> {
//         clearTimeout(timer)
//        }
//     },[input])
       

//   return (
//     <div>

//        <h1> Auto Complete Searchbar </h1>

//        <div className=' m-auto p-4 ml-10'>
//         <input type='text' placeholder='enter something ' value={input} 
//                onChange={(e)=>setInput(e.target.value)} 
//                className='w-60 h-20 border-4 rounded-2xl border-red-500 text-2xl text-blue-500  '
//                onFocus={()=>setShowResults(true)}
//                onBlur={()=>setShowResults(false)}
//         />
//        </div>

//        <div className='result-continaer w-60 m-auto border-2 border-black p-5 '> 
//            {  showResult && (
//               results.map((r)=>
//                  <span key={r.id} className='result  hover:bg-amber-300 hover:cursor-pointer'>
//                     {r.name}
//                  </span>
//               )
//             )
//            }
//        </div>

//     </div>
//   )
// }

// export default AutoCompleteSearchBar



// import React, { useEffect, useState, useRef } from 'react';
//     import { createRoot } from 'react-dom/client';

//     const AutoCompleteSearchBar = () => {
//       const [results, setResults] = useState([]);
//       const [input, setInput] = useState('');
//       const [showResults, setShowResults] = useState(false);
//       const [cache, setCache] = useState({});
//       const [isLoading, setIsLoading] = useState(false);
//       const searchRef = useRef(null);
//       const debounceTimeout = useRef(null);

//       // Handle click outside to hide results
//       useEffect(() => {
//         const handleClickOutside = (event) => {
//           if (searchRef.current && !searchRef.current.contains(event.target)) {
//             setShowResults(false);
//           }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//       }, []);

//       // Debounced API fetch
//       const fetchData = async (query) => {
//         if (!query.trim()) {
//           setResults([]);
//           return;
//         }

//         if (cache[query]) {
//           setResults(cache[query]);
//           return;
//         }

//         setIsLoading(true);
//         try {
//           const response = await fetch(`https://dummyjson.com/recipes/search?q=${encodeURIComponent(query)}`);
//           const json = await response.json();
//           const recipes = json?.recipes || [];
//           setResults(recipes);
//           setCache(prev => ({ ...prev, [query]: recipes }));
//         } catch (error) {
//           console.error('Error fetching data:', error);
//         } finally {
//           setIsLoading(false);
//         }
//       };

//       // Debounce input changes
//       useEffect(() => {
//         if (debounceTimeout.current) {
//           clearTimeout(debounceTimeout.current);
//         }
//         debounceTimeout.current = setTimeout(() => {
//           if (input) fetchData(input);
//         }, 300);

//         return () => clearTimeout(debounceTimeout.current);
//       }, [input]);

//       // Handle input change
//       const handleInputChange = (e) => {
//         setInput(e.target.value);
//         setShowResults(true);
//       };

//       // Handle suggestion click
//       const handleSuggestionClick = (recipeName) => {
//         setInput(recipeName);
//         setShowResults(false);
//       };

//       return (
//         <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10">
//           <h1 className="text-3xl font-bold text-gray-800 mb-6">Recipe Search</h1>
//           <div className="relative w-full max-w-md" ref={searchRef}>
//             <input
//               type="text"
//               placeholder="Search for recipes..."
//               value={input}
//               onChange={handleInputChange}
//               onFocus={() => setShowResults(true)}
//               className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-200 shadow-sm"
//             />
//             {showResults && input && (
//               <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-10">
//                 {isLoading ? (
//                   <div className="p-4 text-gray-500">Loading...</div>
//                 ) : results.length > 0 ? (
//                   results.map((recipe) => (
//                     <div
//                       key={recipe.id}
//                       className="p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition duration-150"
//                       onClick={() => handleSuggestionClick(recipe.name)}
//                     >
//                       <span className="font-medium">{recipe.name}</span>
//                       <span className="block text-sm text-gray-500">{recipe.cuisine}</span>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="p-4 text-gray-500">No results found</div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       );
//     };


// export default AutoCompleteSearchBar 




import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import React, { useEffect, useRef } from 'react';

// AutoCompleteSearchBar Component
const AutoCompleteSearchBar = ({ value, onChange }) => {
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [cache, setCache] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const debounceTimeout = useRef(null);

  // Handle click outside to hide results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced API fetch
  const fetchData = async (query) => {
    if (!query.trim()) {
        setResults([]);
        return;
    }

    if (cache[query]) {
        setResults(cache[query]);
        return;
    }

   setIsLoading(true);
    try {
        // const response = await fetch('http://localhost:5000/api/scheme-names');
        const response=await fetch('https://haqdarshak-stackoverflow-project.onrender.com/api/scheme-names')
        const schemeNames = await response.json();
        const filteredResults = schemeNames.filter(name =>
        name.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filteredResults);
        setCache(prev => ({ ...prev, [query]: filteredResults }));
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setIsLoading(false);
    }
  };

  // Debounce input changes
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      if (value) fetchData(value);
    }, 300);

    return () => clearTimeout(debounceTimeout.current);
  }, [value]);

  // Handle suggestion click
  const handleSuggestionClick = (recipeName) => {
    onChange(recipeName);
    setShowResults(false);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <input
        type="text"
        placeholder="Search for scheme title..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowResults(true)}
        className="w-full p-4 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:border-amber-400 transition-all duration-300 text-gray-800 placeholder-gray-500"
      />
      {showResults && value && (
        <div className="absolute w-full mt-1 bg-white border border-orange-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-10">
          {isLoading ? (
            <div className="p-4 text-gray-500">Loading...</div>
          ) : results.length > 0 ? (
            results.map((scheme, index) => (
                <div
                    key={index}
                    className="p-3 text-gray-700 hover:bg-amber-50 Hover:text-amber-600 cursor-pointer transition duration-150"
                    onClick={() => handleSuggestionClick(scheme)}
                  >
                    <span className="font-medium">{scheme}</span>
                </div>

            )
        )
          ) : (
            <div className="p-4 text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};


export default AutoCompleteSearchBar