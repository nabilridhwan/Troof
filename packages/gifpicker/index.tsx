/** @format */

import { IconSearch, IconX } from "@tabler/icons";
import React, { useEffect, useRef, useState } from "react";
import { BarLoader } from "react-spinners";

import {
  getFeaturedCategories,
  getFeaturedGifs,
  searchForGifs,
} from "@troof/api";
import { motion } from "framer-motion";

interface GifSelectorProps {
  onSelectGif: (url: string) => void;
}

interface MediaFormats {
  gif: {
    url: string;
  };
  tinygif: {
    url: string;
  };
}

interface TenorGif {
  content_description: string;
  created: number;
  flags: ["audio"];
  hadaudio: boolean;
  id: string;
  itemurl: string;
  media_formats: Partial<MediaFormats>;
  tags: string[];
  title: string;
  url: string;
}

const GifPicker = ({ onSelectGif }: GifSelectorProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [gifsData, setGifsData] = useState<TenorGif[]>([]);

  const [featuredCategories, setFeaturedCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleGifClick = (gif: TenorGif) => {
    // This is a hacky way because appending .gif to the end of the url will always return the gif and also render gif in the text chat according to the Regex Helper
    // const link = gif.images.original.url + ".gif";
    console.log(gif);

    if (gif.media_formats.gif) {
      onSelectGif(gif.media_formats.gif.url);
      return;
    }

    if (gif.media_formats.tinygif) {
      onSelectGif(gif.media_formats.tinygif.url);
      return;
    }
  };

  const handleGifSearch = async (e: any) => {
    e.preventDefault();

    if (searchQuery === "") return;

    searchForGifsAndSetState(searchQuery);
  };

  const searchForGifsAndSetState = async (query: string) => {
    console.log(`Searching for gifs... ${query}`);
    setLoading(true);
    const { results } = await searchForGifs(query);
    setLoading(false);
    setGifsData(results);
  };

  useEffect(() => {
    // Focus on the input box when the component is mounted
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }

    (async () => {
      const categoriesData = await getFeaturedCategories();

      const { tags: categories } = categoriesData;

      const mappedCategories = categories.map(
        (t: { [prop: string]: string }) => t.searchterm
      );

      setFeaturedCategories(mappedCategories.slice(0, 10));

      // If there is no search query, fetch the featured gifs and featured categories
      if (searchQuery === "") {
        setLoading(true);
        const { results } = await getFeaturedGifs();
        setLoading(false);

        setGifsData(results);
      } else {
        setLoading(true);
        const { results } = await searchForGifs(searchQuery);
        setLoading(false);
        setGifsData(results);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (searchQuery === "") {
        setLoading(true);
        const { results } = await getFeaturedGifs();
        setLoading(false);

        setGifsData(results);
      }
    })();
  }, [searchQuery]);

  return (
    <div className="w-full rounded-xl border border-black/20 bg-white p-2 shadow-lg">
      <p className="font-black">GIF</p>

      <form onSubmit={handleGifSearch}>
        <div className="relative my-2 flex gap-2">
          <input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a gif"
            className="relative h-[5px] flex-1 bg-white"
          />

          {searchQuery.length > 0 && (
            <button
              onClick={() => setSearchQuery("")}
              type="button"
              className="absolute right-16  flex h-full items-center px-2"
            >
              <IconX size={18} />
            </button>
          )}

          <button
            type="submit"
            className=" flex items-center gap-2 rounded-lg border border-purple-900/20 bg-purple-300 px-4 text-purple-900"
          >
            <IconSearch size={16} />
          </button>
        </div>
      </form>

      <p className="my-0.5 mt-3 text-sm font-semibold">Featured Categories</p>
      <div className="flex gap-2 overflow-x-scroll text-sm">
        {featuredCategories &&
          featuredCategories.map((category, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setSearchQuery(category);
                searchForGifsAndSetState(category);
              }}
              style={{
                // Set color of button to be hsl
                backgroundColor: `hsl(${index * 20}, 100%, 85%)`,
                color: `hsl(${index * 20}, 100%, 25%)`,
                border: `1px solid hsl(${index * 20}, 100%, 45%)`,
              }}
              className="relative my-2 flex items-center rounded-lg p-1.5 px-3"
            >
              {category}
            </motion.button>
          ))}
      </div>

      {/* Show 'Search for gifs by typing in the input box above' when there is no gifs */}
      {!gifsData && (
        <p className="my-5 mb-0 px-10 text-center font-semibold text-gray-500">
          Search for gifs by typing in the input box above
        </p>
      )}

      {/* Show loading spinner */}
      {loading && (
        <div className="my-5 flex items-center justify-center">
          <BarLoader color="#6B46C1" loading={loading} width={100} />
        </div>
      )}

      {/* Where all the gifs are */}
      {!loading && gifsData.length > 0 && (
        <motion.div
          layout
          className="grid max-h-[350px] grid-flow-dense grid-cols-2 flex-wrap gap-2 overflow-auto rounded-xl"
        >
          {gifsData.map((gif, index) => (
            <motion.div
              key={index}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleGifClick(gif)}
              className=" rounded-xl border-black"
            >
              <picture className="h-full w-full">
                <img
                  src={gif.media_formats.tinygif?.url}
                  alt=""
                  className="h-full w-fit rounded-xl border object-contain shadow-sm"
                />
              </picture>
            </motion.div>
          ))}
        </motion.div>
      )}

      <p className="mt-4 text-xs text-black/40">
        Powered by Tenor, built by Nabil
      </p>
    </div>
  );
};

export default GifPicker;
