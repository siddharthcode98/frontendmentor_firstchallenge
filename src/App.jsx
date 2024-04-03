import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./App.css";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { SpinnerCircular } from "spinners-react";

function App() {
  const [searchValue, setSearchValue] = useState("");
  const [ipResult, setIpResult] = useState("");
  const [isLoading, setLoading] = useState(false);

  //useeffect to get the IP address of the user
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await fetch("https://api.ipify.org/?format=json");
        const data = await res.json();
        console.log(data.ip);

        const res2 = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=at_3RyX5aT04WwPFYvw53RMRGsEHsGSM&ipAddress=${data.ip}`
        );
        const userIpAddresss = await res2.json();

        if (isMounted) {
          setLoading((prevState) => !prevState.isLoading);
          setIpResult(userIpAddresss);
        }
      } catch (error) {
        throw new Error("Fetch Error", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  //below function is called when user searches for Ip Address
  const fetchIpAddressDetails = async () => {
    try {
      const res = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_3RyX5aT04WwPFYvw53RMRGsEHsGSM&ipAddress=${searchValue}`
      );
      if (res.ok) {
        const IpDetails = await res.json();
        setSearchValue("");
        setIpResult(IpDetails);
        console.log(IpDetails);
      } else {
        throw new Error("Failed to get the IP address");
      }
    } catch (error) {
      return new Error("Fetch Error", error);
    }
  };

  return (
    <>
      {isLoading ? (
        <>
          <main className="h-screen">
            <section className=" bg-[url('../images/pattern-bg-desktop.png')] bg-cover h-1/3">
              <div className="flex flex-col items-center justify-center h-[100%] gap-2">
                <h1 className="text-white text-2xl ">IP Address Tracker</h1>
                <div className="flex flex-row lg:w-3/12 h-10 ">
                  <input
                    type="search "
                    className="w-[100%] rounded-tl-md rounded-bl-md outline-none p-3"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search for an IP address or domain "
                  />
                  <button
                    className="bg-black rounded-tr-md rounded-br-md p-2"
                    type="button"
                    onClick={fetchIpAddressDetails}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="11"
                      height="14"
                    >
                      <path
                        fill="none"
                        stroke="#FFF"
                        strokeWidth="3"
                        d="M2 1l6 6-6 6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </section>

            <section className="top-[25%] h-2/3">
              <MapContainer
                center={[ipResult.location.lat, ipResult.location.lng]}
                zoom={13}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[ipResult.location.lat, ipResult.location.lng]}
                >
                  <Popup>{ipResult.location.region}</Popup>
                </Marker>
              </MapContainer>
            </section>
          </main>
          <section className=" absolute w-full top-[230px] flex justify-center ">
            <div className=" bg-white rounded-md lg:w-3/4 md:w-3/4 shadow-md z-[9999] p-3 flex items-center ">
              <div className="grid md:grid-cols-4 grid-cols-1 md:divide-x-2  p-2 grow ">
                <div className=" p-2 text-center">
                  <p className="text-gray-400 text-sm">IP ADDRESS</p>
                  <h3 className="text-current md:text-xl lg:text-3xl">
                    {ipResult.ip}
                  </h3>
                </div>
                <div className=" p-2 text-center">
                  <p className="text-gray-400 text-sm">LOCATION</p>
                  <h3 className="text-current md:text-xl lg:text-3xl">
                    {ipResult.location.region},{ipResult.location.country}
                  </h3>
                </div>
                <div className=" p-2 text-center">
                  <p className="text-gray-400 text-sm">TIME ZONE</p>
                  <h3 className="text-current md:text-xl lg:text-3xl">
                    {ipResult.location.timezone}
                  </h3>
                </div>
                <div className=" p-2 text-center">
                  <p className="text-gray-400 text-sm">ISP</p>
                  <h3 className="text-current md:text-xl lg:text-3xl">
                    {ipResult.isp}
                  </h3>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="absolute top-[50%] left-[50%]">
          <SpinnerCircular />
        </div>
      )}
    </>
  );
}

export default App;
