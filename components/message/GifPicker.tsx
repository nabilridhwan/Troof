import { GiphyFetch } from "@giphy/js-fetch-api";
import { IGif } from "@giphy/js-types";
import { IconSearch } from "@tabler/icons";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BarLoader } from "react-spinners";

// use @giphy/js-fetch-api to fetch gifs, instantiate with your api key
const gf = new GiphyFetch("aB4fpoNK0G1zbgEyasDKxiV63QxM4DqI");

// configure your fetch: fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)

interface GifSelectorProps {
	onSelectGif: (url: string) => void;
}

const GifPicker = ({ onSelectGif }: GifSelectorProps) => {
	const searchInputRef = useRef<HTMLInputElement>(null);

	const [searchQuery, setSearchQuery] = useState("");
	const [gifsData, setGifsData] = useState<IGif[]>([]);

	const [loading, setLoading] = useState(false);

	const handleGifClick = (gif: IGif) => {
		// This is a hacky way because appending .gif to the end of the url will always return the gif and also render gif in the text chat according to the Regex Helper
		const link = gif.images.original.url + ".gif";
		// console.log(link);
		onSelectGif(link);
	};

	const fetchGifs = (offset: number) => gf.trending({ offset, limit: 30 });

	const searchGifs = (offset: number, query: string) =>
		gf.search(query, { offset, limit: 30 });

	const handleGifSearch = async (e: any) => {
		e.preventDefault();
		setSearchQuery(e.target.value);

		setLoading(true);

		const results = await searchGifs(0, searchQuery);

		setLoading(false);
		setGifsData(results.data);
	};

	useEffect(() => {
		if (searchInputRef.current) {
			searchInputRef.current.focus();
		}
		// Make a debounce function
		(async () => {
			if (searchQuery === "") {
				setLoading(true);
				const results = await fetchGifs(0);

				setLoading(false);

				setGifsData(results.data);
			} else {
				setLoading(true);
				const results = await searchGifs(0, searchQuery);
				setLoading(false);
				setGifsData(results.data);
			}
		})();
	}, []);

	useEffect(() => {
		(async () => {
			if (searchQuery === "") {
				setLoading(true);
				const results = await fetchGifs(0);

				setLoading(false);

				setGifsData(results.data);
			}
		})();
	}, [searchQuery]);

	return (
		<div className="w-full bg-white rounded-xl p-2 border border-black/20 shadow-lg text-sm">
			<p className="font-bold">GIF Selector</p>

			<form onSubmit={handleGifSearch}>
				<div className="flex my-2 gap-2">
					<input
						ref={searchInputRef}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search for a gif"
						className="h-[5px] flex-1 bg-white"
					/>

					<button className=" bg-purple-300 text-purple-900 rounded-lg px-4 flex items-center gap-2 border border-purple-900/20">
						<IconSearch size={16} />
					</button>
				</div>
			</form>

			{/* Show 'Search for gifs by typing in the input box above' when there is no gifs */}
			{!gifsData.length && (
				<p className="font-semibold text-center text-gray-500 px-10 my-5 mb-0">
					Search for gifs by typing in the input box above
				</p>
			)}

			{/* Show loading spinner */}
			<div className="flex justify-center items-center my-5">
				<BarLoader color="#6B46C1" loading={loading} width={100} />
			</div>

			{/* Where all the gifs are */}
			{!loading && gifsData.length > 0 && (
				<motion.div
					layout
					className="content-start grid grid-cols-2 flex-wrap max-h-[400px] overflow-auto gap-2 grid-flow-dense rounded-xl shadow-md"
				>
					{gifsData.map((gif, index) => (
						<motion.div
							key={index}
							whileTap={{ scale: 0.9 }}
							onClick={() => handleGifClick(gif)}
							className=" h-fit rounded-xl border-black"
						>
							<picture className="w-full h-full">
								<img
									src={gif.images.original.url}
									alt=""
									className="w-fit object-cover rounded-xl"
								/>
							</picture>
						</motion.div>
					))}
				</motion.div>
			)}

			<p className="text-xs text-black/40 mt-4">
				Powered by Giphy, built by Nabil
			</p>
		</div>
	);
};

export default GifPicker;
