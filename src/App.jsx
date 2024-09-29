import { useState, useCallback, useEffect, useRef } from 'react';
import './App.css';

function App() {
   const [length, setLength] = useState(8);
   const [numbersAllowed, setNumbersAllowed] = useState(false);
   const [charsAllowed, setCharsAllowed] = useState(false);
   const [password, setPassword] = useState("");
   const passwordRef = useRef(null);

   const passwordGenerator = useCallback(() => {
      let pass = "";
      let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      if (numbersAllowed) str += "0123456789";
      if (charsAllowed) str += "[]{}~@*=+-_`^*!#$%&";

      for (let i = 1; i <= length; i++) {
         let char = Math.floor(Math.random() * str.length);
         pass += str.charAt(char);
      }
      setPassword(pass);
   }, [length, numbersAllowed, charsAllowed]);

   const copyToClipboard = useCallback(() => {
      passwordRef.current?.select();
      passwordRef.current?.setSelectionRange(0, 101);
      try {
         window.navigator.clipboard.writeText(password)
            .then(() => alert('Password copied to clipboard!'))
            .catch(err => console.error('Failed to copy: ', err));
      } catch (err) {
         console.error('Clipboard access error: ', err);
         alert('Failed to copy password. Please try again.');
      }
   }, [password]);

   useEffect(() => {
      passwordGenerator();
   }, [length, numbersAllowed, charsAllowed, passwordGenerator]);

   const getPasswordStrength = () => {
      // Example logic to determine password strength based on length and character options
      if (length >= 12 && numbersAllowed && charsAllowed) {
         return 'Strong';
      } else if (length >= 8 && (numbersAllowed || charsAllowed)) {
         return 'Medium';
      } else {
         return 'Weak';
      }
   };

   const regeneratePassword = () => {
      passwordGenerator();
   };

   return (
      <div className='w-full max-w-md mx-auto shadow-md rounded-lg p-6 my-8 text-orange-600 bg-gray-800'>
         <h1 className="text-white text-center text-2xl mb-6">Generate Password</h1>
         
         <div className="flex shadow rounded-lg overflow-hidden mb-4">
             <input 
               type="text" 
               value={password} 
               className='outline-none w-full py-2 px-3 text-lg bg-gray-700 text-white' 
               placeholder='password' 
               readOnly
               ref={passwordRef}
             />
             <button 
               className="outline-none bg-cyan-500 text-white py-2 px-4 shrink-0 hover:bg-cyan-600 transition duration-200" 
               onClick={copyToClipboard}
             > 
               Copy
            </button>
         </div>

         <div className="flex text-sm gap-x-4 mb-4">
            <div className="flex items-center gap-x-2">
               <label className="text-white">Length:</label>
               <input 
                  type="range" 
                  min={6} 
                  max={100} 
                  value={length} 
                  className='cursor-pointer'
                  onChange={(e) => setLength(Number(e.target.value))}
               />
               <span className="text-white">{length}</span>
            </div>
         </div>
         
         <div className="flex text-sm gap-x-4">
            <div className="flex items-center gap-x-2">
               <input 
                  type="checkbox" 
                  checked={numbersAllowed} 
                  id="numberInput" 
                  onChange={() => setNumbersAllowed(prev => !prev)}
               />
               <label htmlFor="numberInput" className="text-white">Numbers</label>
            </div>
            <div className="flex items-center gap-x-2">
               <input 
                  type="checkbox" 
                  checked={charsAllowed} 
                  id="charInput" 
                  onChange={() => setCharsAllowed(prev => !prev)}
               />
               <label htmlFor="charInput" className="text-white">Characters</label>
            </div>
         </div>

         <div className="mt-4 text-sm text-white">
            Password Strength: {getPasswordStrength()}
         </div>

         <div className="flex justify-center mt-4">
            <button
               className="bg-gray-600 text-white py-2 px-4 rounded-lg"
               onClick={regeneratePassword}
            >
               Regenerate Password
            </button>
         </div>
      </div>
   );
}

export default App;
