'use client';

import Image from "next/image";
import Logo from "../../../public/logo.png";
import { RiArrowDropDownLine, RiMenuLine } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { TfiWorld } from "react-icons/tfi";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import NavButtons from "./NavButtons";
import ShoppingCartPage from "./NavButtons";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SidebarNav from "./SidebarNav";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Languages, QUERY_PARAMS } from "@/constants";

export default function Navbar() {
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [openSidebarNav, setOpenSidebarNav] = useState(false);
    const [iconPopOver, setIconPopOver] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const { isAuthenticated, isLoading, data } = useSelector((state: RootState) => state.user);
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();
    const queryString = searchParams.get(QUERY_PARAMS.search);

    // If the user cleared what they searched, remove the search query in the URI to reflect the current state
    useEffect(() => {
        if (queryString && !searchValue) {
            replace(`${pathname}`);
        }
    }, [searchValue, pathname, queryString, replace]);

    // Update the selected language
    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setSelectedLanguage(e.target.value);
    }

    // Handle search input and update the URL query params
    function handleSearch() {
        const param = new URLSearchParams(searchParams);
        if (searchValue) {
            param.set(QUERY_PARAMS.search, searchValue);
        } else {
            param.delete(QUERY_PARAMS.search);
        }
        replace(`${pathname}?${param.toString()}`);
    }

    return (
        <nav className="relative inset-x-0 top-0 mt-5 max-md:px-7 md:px-7 xl:px-20">
            <div className="flex items-center justify-between sm:gap-20 md:gap-10">
                <div className="flex items-start">
                    <button onClick={() => setOpenSidebarNav(true)} className="max-sm:mr-2.5">
                        <RiMenuLine className="md:hidden w-8 h-8 text-navy" />
                    </button>
                    <div className="max-md:hidden flex items-center">
                        <Link href="/" className="w-[25px] h-[10px] mb-5">
                            <Image src={Logo} alt="logo" width={30} height={30} />
                        </Link>
                        <Popover>
                            <PopoverTrigger className="ml-4">
                                <div onClick={() => setIconPopOver((open) => !open)}>
                                    <RiArrowDropDownLine className="w-4 h-4" />
                                </div>
                            </PopoverTrigger>
                            {iconPopOver && (
                                <PopoverContent className="w-[150px] h-auto mt-4">
                                    <p>Specific pages will be placed here</p>
                                </PopoverContent>
                            )}
                        </Popover>
                    </div>
                    <div className="max-md:hidden px-3 py-2.5 ml-7 bg-button flex items-center gap-1">
                        <TfiWorld className="w-4 h-3" />
                        <select
                            value={selectedLanguage}
                            onChange={handleChange}
                            className="bg-button focus-visible:outline-none text-sm"
                        >
                            {Languages.map((language) => (
                                <option key={language} value={language} className="text-sm p-2">
                                    {language}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Nav Links */}
                <div className="text-[#777E90] text-sm">
                    <ul className="flex space-x-4">
                        <li className="hover:text-gray-400">
                            <Link href="/">Home</Link>
                        </li>
                        <li className="hover:text-gray-400">
                        <Link href="/about-us">About</Link>
                        </li>
                        <li className="hover:text-gray-400">
                            <Link href="/video-blogs">Blogs</Link>
                        </li>
                        {pathname !== '/' && (
                        <li className="hover:text-gray-400">
                            <Link href="/create-blog">Create Blog</Link>
                        </li>
                        )}
                        <li className="hover:text-gray-400">
                            <Link href="/contact">Contact</Link>
                        </li>
                    </ul>
                </div>

                {/* Search Bar  Only The Access on Home Page*/}
                {pathname === '/' && (
                    <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                    }}
                    className={`flex items-center bg-button ${
                        isAuthenticated && data
                            ? "max-sm:w-[140px] sm:w-[280px] md:w-[230px] lg:w-[300px]"
                            : "max-sm:w-[130px] sm:w-[280px] md:w-[320px] lg:w-[300px]"
                    } h-[48px] max-md:px-2 max-sm:py-2 md:px-5 rounded-md`}
                >
                    <input
                        type="text"
                        placeholder="Type to Search..."
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="bg-button max-sm:w-[100px] sm:w-[240px] md:w-[280px] p-2 max-sm:text-xs sm:text-sm focus-visible:outline-none"
                    />
                    <button type="submit" onClick={handleSearch} className="mr-5">
                        <CiSearch className="w-5 h-5" />
                    </button>
                </form>
                
                )}

                {/* Prevent Layout Shift */}
                <div className="max-sm:w-[125px] sm:w-[350px] md:w-[400px]">
                    {!isLoading && <NavButtons />} 
                    {openSidebarNav && (
                        <SidebarNav setOpenSidebarNav={setOpenSidebarNav} isAuthenticated={isAuthenticated} />
                    )}
                </div>
            </div>
        </nav>
    );
}
