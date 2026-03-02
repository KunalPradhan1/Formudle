
"use client"
import React, {useEffect, useState}  from 'react'

interface Driver {
  id: string;
  fullName: string;
  team: string;
  nationality: string;
  permanentNumber: number;
  dateOfBirth: string;
  championships: number;
  status: string;
  era: string;
}


export default function Home() {

  const [message, setMessage] = useState("Loading");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filterDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [random, setRandom] = useState<Driver>();
  const [gameWon, setGameWon] = useState(false);
  // const [carPosition, setCarPosition] = useState(-100);
  const [animatingRow, setAnimatingRow] = useState<number | null>(null);


  const [selectedDrivers, setSelectedDrivers] = useState<Driver[]>([]);


  const answerCategories = [ "Racer" , "Last Team", "Age", "Nationality", "Championships", "Racing Number"];


  //testing search 
  
  useEffect(() => {
    if(searchQuery.trim() === ""){
      setFilteredDrivers([]);
      setShowDropdown(false);
    
    }
    else{
      const filtered = drivers.filter(driver => driver.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredDrivers(filtered);
      setShowDropdown(filtered.length > 0);
    }
  }, [searchQuery,drivers]);

  useEffect(() => {
    fetch("/api/random").then(
      response => response.json()
    ).then(
      data => {
        //console.log(data)
        setMessage(data.fullName)
        setRandom(data);
      }
    )

    fetch("/api/drivers").then(
      response => response.json()
    ).then(
      data => {
        //console.log(data)
        setDrivers(data)
      }
    )
  }, [])

  const handleSelectDriver = (driver: Driver) => {
    
    setSelectedDrivers([driver, ...selectedDrivers]);
    setSearchQuery("");
    setShowDropdown(false);
    
    // Trigger flip animation for the new row
    setAnimatingRow(0);
    
    // Reset animation state and check for win after animation completes
    setTimeout(() => {
      setAnimatingRow(null);
      if(random && driver.id === random.id){
        setGameWon(true);
      }
    }, 3500);
    
    console.log("handleSearch is called");

  };


  const calculateAge = (dateOfBirth:string) =>{
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth() - birth.getMonth();
    if(month < 0 || (month === 0 && today.getDate() < birth.getDate())){
      age--;
    }

    return age;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Race track stripes background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-2 bg-white"></div>
        <div className="absolute top-8 left-0 w-full h-1 bg-red-500"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-white"></div>
        <div className="absolute bottom-8 left-0 w-full h-1 bg-red-500"></div>
      </div>

      {/* Checkered flag header */}
      <header className="relative z-10 bg-gradient-to-r from-black via-gray-900 to-black border-b-4 border-red-600">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-4">
            {/* Checkered flag pattern */}
            <div className="grid grid-cols-4 grid-rows-4 w-16 h-16 border-2 border-white">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className={`${
                    (Math.floor(i / 4) + i) % 2 === 0 ? 'bg-white' : 'bg-black'
                  }`}
                ></div>
              ))}
            </div>
            <h1 className="text-5xl font-bold text-white tracking-wider">
              FORMULDLE
            </h1>
            <div className="grid grid-cols-4 grid-rows-4 w-16 h-16 border-2 border-white">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className={`${
                    (Math.floor(i / 4) + i) % 2 === 0 ? 'bg-white' : 'bg-black'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
  <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-red-600 rounded-lg p-8 max-w-2xl mx-auto shadow-2xl">
    <h2 className="text-2xl font-bold text-white mb-6 text-center">Guess the Driver</h2>
    
    {/* Search Bar */}
    <div className="relative mb-6">
      <input
        type="text"
        value={searchQuery}
        disabled={gameWon || animatingRow !== null}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => {
          if (searchQuery.trim() === "") {
            setFilteredDrivers(drivers);
            setShowDropdown(drivers.length > 0);
          }
        }}
        placeholder="Start typing a driver's name..."
        className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:border-red-600 transition-colors"
      />




      
      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute w-full mt-2 bg-gray-800 border-2 border-red-600 rounded-lg max-h-60 overflow-y-auto z-20">
          {filterDrivers.map((driver, index) => (
            <div
              key={index}
              onClick={() => handleSelectDriver(driver)}
              className="px-4 py-3 text-white hover:bg-red-600 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0"
            >
              {driver.fullName}
            </div>
          ))}
        </div>
      )}



            
{/* testing boxes */}
<div className="mb-8 mt-4">
  <div className="flex -space-x-[2px] mb-[-2px]">
    {answerCategories.map((cat) => (
      <div
        key={cat}
        className="flex-1 px-2 py-2 bg-gray-800 border-2 border-gray-600 text-center text-xs text-gray-200 font-semibold"
      >
        {cat}
      </div>
    ))}
  </div>
  <div className="flex -space-x-[2px]">
  </div>
</div>


    
    
  {selectedDrivers.map((driver, idx) => (
    <div key={idx} className="flex -space-x-[2px] mb-2">
      {/* Name - NO FLIP */}
      <div className="flex-1 h-24 px-2 bg-gray-700 border-2 border-gray-600 text-center text-base text-white flex items-center justify-center">
        {driver.fullName}
      </div>
{/* Team - FLIPS */}
<div 
  className="flex-1 h-24 px-2 border-2 border-gray-600 text-center text-base text-white flex items-center justify-center"
  style={{
    animation: animatingRow === idx ? `flipTile 1s ease ${0 * 0.5}s both` : 'none',
    transformStyle: 'preserve-3d',
    backgroundColor: animatingRow !== idx ? (random && driver.team === random.team ? '#16a34a' : '#dc2626') : undefined,
    // @ts-ignore
    '--tile-color': random && driver.team === random.team ? '#16a34a' : '#dc2626',
  }}
>
  <span 
    style={{
      animation: animatingRow === idx ? `flipText 1s ease ${0 * 0.5}s both` : 'none',
      transformStyle: 'preserve-3d',
      display: 'inline-flex',
      alignItems: 'center'
    }}
  >
    {driver.team}
  </span>
</div>

{/* Age - FLIPS */}
<div 
  className="flex-1 h-24 px-2 border-2 border-gray-600 text-center text-base text-white flex items-center justify-center gap-2"
  style={{
    animation: animatingRow === idx ? `flipTile 1s ease ${1 * 0.5}s both` : 'none',
    transformStyle: 'preserve-3d',
    backgroundColor: animatingRow !== idx ? (random && calculateAge(driver.dateOfBirth) === calculateAge(random.dateOfBirth) ? '#16a34a' : '#dc2626') : undefined,
    // @ts-ignore
    '--tile-color': random && calculateAge(driver.dateOfBirth) === calculateAge(random.dateOfBirth) ? '#16a34a' : '#dc2626',
  }}
>
  <span 
    style={{
      animation: animatingRow === idx ? `flipText 1s ease ${1 * 0.5}s both` : 'none',
      transformStyle: 'preserve-3d',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}
  >
    {(() => {
      let age = calculateAge(driver.dateOfBirth);
      if (random) {
        let randomAge = calculateAge(random.dateOfBirth);
        
        if (age < randomAge) {
          return <><span>{age}</span><span className="text-xl">↑</span></>;
        } else if (age > randomAge) {
          return <><span>{age}</span><span className="text-xl">↓</span></>;
        }
      } 
      return age;
    })()}
  </span>
</div>

{/* Nationality - FLIPS */}
<div 
  className="flex-1 h-24 px-2 border-2 border-gray-600 text-center text-base text-white flex items-center justify-center"
  style={{
    animation: animatingRow === idx ? `flipTile 1s ease ${2 * 0.5}s both` : 'none',
    transformStyle: 'preserve-3d',
    backgroundColor: animatingRow !== idx ? (random && driver.nationality === random.nationality ? '#16a34a' : '#dc2626') : undefined,
    // @ts-ignore
    '--tile-color': random && driver.nationality === random.nationality ? '#16a34a' : '#dc2626',
  }}
>
  <span 
    style={{
      animation: animatingRow === idx ? `flipText 1s ease ${2 * 0.5}s both` : 'none',
      transformStyle: 'preserve-3d',
      display: 'inline-flex',
      alignItems: 'center'
    }}
  >
    {driver.nationality}
  </span>
</div>

{/* Championships - FLIPS */}
<div 
  className="flex-1 h-24 px-2 border-2 border-gray-600 text-center text-base text-white flex items-center justify-center gap-2"
  style={{
    animation: animatingRow === idx ? `flipTile 1s ease ${3 * 0.5}s both` : 'none',
    transformStyle: 'preserve-3d',
    backgroundColor: animatingRow !== idx ? (random && driver.championships === random.championships ? '#16a34a' : '#dc2626') : undefined,
    // @ts-ignore
    '--tile-color': random && driver.championships === random.championships ? '#16a34a' : '#dc2626',
  }}
>
  <span 
    style={{
      animation: animatingRow === idx ? `flipText 1s ease ${3 * 0.5}s both` : 'none',
      transformStyle: 'preserve-3d',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}
  >
    {(() => {
      if(random){
        let randNum = random?.championships;
        let driveNum = driver.championships;
        if(driveNum < randNum){
          return <><span>{driveNum}</span><span className="text-xl">↑</span></>
        }
        else if(driveNum > randNum){
          return <><span>{driveNum}</span><span className="text-xl">↓</span></>
        }
      }
      return driver.championships;
    })()}
  </span>
</div>

{/* Racing Number - FLIPS */}
<div 
  className="flex-1 h-24 px-2 border-2 border-gray-600 text-center text-base text-white flex items-center justify-center gap-2"
  style={{
    animation: animatingRow === idx ? `flipTile 1s ease ${4 * 0.5}s both` : 'none',
    transformStyle: 'preserve-3d',
    backgroundColor: animatingRow !== idx ? (random && driver.permanentNumber === random.permanentNumber ? '#16a34a' : '#dc2626') : undefined,
    // @ts-ignore
    '--tile-color': random && driver.permanentNumber === random.permanentNumber ? '#16a34a' : '#dc2626',
  }}
>
  <span 
    style={{
      animation: animatingRow === idx ? `flipText 1s ease ${4 * 0.5}s both` : 'none',
      transformStyle: 'preserve-3d',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}
  >
    {(() => {
      if(random){
        let randNum = random?.permanentNumber;
        let driveNum = driver.permanentNumber;
        if(driveNum < randNum){
          return <><span>{driveNum}</span><span className="text-xl">↑</span></>
        }
        else if(driveNum > randNum){
          return <><span>{driveNum}</span><span className="text-xl">↓</span></>
        }
      }
      return driver.permanentNumber;
    })()}
  </span>
      </div>
    </div>
  ))}
    
    
    {gameWon && (
    <div className="mt-6 p-4 bg-green-600 border-2 border-green-400 rounded-lg text-center">
      <p className="text-2xl font-bold text-white">🏆 Congratulations! You won! 🏆</p>
    </div>
  )}
    
    
    </div>

    


  
    
    <p className="text-xl text-gray-400 text-center">Mystery Driver: {message}</p>
  </div>
</main>

      {/* Race track silhouette at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-red-600/20 to-transparent"></div>
    </div>
  );
}
