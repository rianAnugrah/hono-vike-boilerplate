"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import {
  Archive,
  BookCopy,
  ChevronLeftIcon,
  Clock10Icon,
  HomeIcon,
  LayoutDashboard,
  LayoutDashboardIcon,
  MapPin,
  MenuIcon,
  ScanQrCode,
  SearchCheck,
  SidebarCloseIcon,
  User2,
} from "lucide-react";
import { Link } from "@/renderer/Link";
import DesktopLink from "./desktop-link";
import MobileLink from "./mobile-link";
import { AnimatePresence, motion } from "framer-motion";
import { useUserStore } from "@/stores/store-user-login";
// import Logo from "@/components/svg/logo";
import UserDropDown from "../user-dropdown";
import GlassButton from "../glass-button/glass-button";
import Tooltip from "../tooltip/tooltip";

export default function Navbar() {
  return (
    <>
      <MobileNavbar />
      <DesktopNav />
    </>
  );
}

function MobileNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { role } = useUserStore();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="bg-gradient-to-br from-cyan-950 to-blue-950 md:hidden border-t w-full bottom-0 fixed z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex justify-between items-center w-full">
              <MobileLink href="/dashboard" icon={<HomeIcon />} label="Home" />
              <MobileLink href="/asset" icon={<Archive />} label="Asset" />
              <a
                href="/qr-scanner"
                className="text-xl bg-orange-600 p-1 shadow rounded flex flex-col items-center gap-1 text-white active:scale-95 transition-all duration-100"
              >
                <ScanQrCode className="w-10 h-10" />
              </a>

              {role !== "admin" ? (
                <div>&nbsp;</div>
              ) : (
                <>
                  <MobileLink
                    href="/inspection"
                    icon={<SearchCheck />}
                    label="Inspection"
                  />
                </>
              )}
              <button
                onClick={() => setMenuOpen(true)}
                className="text-xl flex flex-col items-center gap-1 text-white active:scale-95 transition-all group"
                aria-label="Open menu"
              >
                <MenuIcon className="group-hover:scale-[1.2] transition-all duration-300 w-6 h-6" />
                <span className="text-xs">Menu</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Drawer Portal */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {menuOpen && (
              <div
                className="drawer-container"
                style={{ position: "relative", zIndex: 10000 }}
              >
                {/* Overlay */}
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMenuOpen(false)}
                />

                {/* Mobile Drawer Sidebar */}
                <motion.div
                  className="fixed left-0 top-0 bottom-0 w-64 bg-gray-100 shadow-lg z-[9999] flex flex-col overflow-hidden"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "tween", duration: 0.3 }}
                  style={{ maxHeight: "100vh" }}
                >
                  <div className="py-2">
                    <UserDropDown />
                  </div>

                  <div className="flex flex-col p-2 gap-1 overflow-y-auto">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 text-gray-500 hover:text-orange-600 p-3 rounded-md transition-all"
                    >
                      <HomeIcon className="w-5 h-5" />
                      <span>Home</span>
                    </Link>

                    <Link
                      href="/asset"
                      className="flex items-center gap-3 text-gray-500 hover:text-orange-600 p-3 rounded-md transition-all"
                    >
                      <Archive className="w-5 h-5" />
                      <span>Asset</span>
                    </Link>

                    {role === "pic" && (
                      <Link
                        href="/inspection"
                        className="flex items-center gap-3 text-gray-500 hover:text-orange-600 p-3 rounded-md transition-all"
                      >
                        <SearchCheck className="w-5 h-5" />
                        <span>Inspect</span>
                      </Link>
                    )}

                    {role === "admin" && (
                      <>
                        <Link
                          href="/inspection"
                          className="flex items-center gap-3 text-gray-500 hover:text-orange-600 p-3 rounded-md transition-all"
                        >
                          <SearchCheck className="w-5 h-5" />
                          <span>Inspect</span>
                        </Link>

                        <Link
                          href="/category"
                          className="flex items-center gap-3 text-gray-500 hover:text-orange-600 p-3 rounded-md transition-all"
                        >
                          <BookCopy className="w-5 h-5" />
                          <span>Code</span>
                        </Link>

                        <Link
                          href="/location"
                          className="flex items-center gap-3 text-gray-500 hover:text-orange-600 p-3 rounded-md transition-all"
                        >
                          <MapPin className="w-5 h-5" />
                          <span>Zone</span>
                        </Link>

                        <Link
                          href="/user"
                          className="flex items-center gap-3 text-gray-500 hover:text-orange-600 p-3 rounded-md transition-all"
                        >
                          <User2 className="w-5 h-5" />
                          <span>User</span>
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="p-3 mt-3">
                    <Link
                      href="/qr-scanner"
                      className="bg-orange-600 hover:bg-orange-500 w-full py-3 px-4 flex items-center justify-center gap-2 rounded-md text-white font-medium"
                    >
                      <ScanQrCode className="w-5 h-5" />
                      <span>Scan QR Code</span>
                    </Link>
                  </div>

                  <div className="flex-grow"></div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

function DesktopNav() {
  const { role } = useUserStore();
  const [isCompact, setIsCompact] = useState(false);
  const [dateTime, setDateTime] = useState<string>("");

  useEffect(() => {
    // Load preference from localStorage on mount
    const savedCompactState = localStorage.getItem("sidebarCompact");
    if (savedCompactState !== null) {
      setIsCompact(savedCompactState === "true");
    }
  }, []);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDateTime(
        now.toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav
      className={`hidden md:flex flex-col h-[100svh] gap-2 transition-all duration-300 
        px-2 py-2 relative  `}
    >

      <div className="flex flex-col h-full gap-1 bg-white/50   border border-white/20 shadow-glass  p-3 w-[16rem]  backdrop-blur-sm rounded-2xl">
        <div className="flex gap-2">
          <Tooltip placement="left" content={`Back to HCML Portal`}>
            <GlassButton fluid={false} size="sm">
              <LayoutDashboardIcon size={14} />
            </GlassButton>
          </Tooltip>

          <div className="block flex-grow"></div>
          <GlassButton fluid={false} variant="ghost" size="sm">
            <SidebarCloseIcon size={14} />
          </GlassButton>
        </div>

        <div className=" flex items-center justify-center">
          <UserDropDown />
        </div>

        <DesktopLink
          href="/dashboard"
          icon={<HomeIcon />}
          label="Home"
          isCompact={isCompact}
        />
        <DesktopLink
          href="/asset"
          icon={<Archive />}
          label="Asset"
          isCompact={isCompact}
        />
        {role === "pic" && (
          <DesktopLink
            href="/inspection"
            icon={<SearchCheck />}
            label="Inspect"
            isCompact={isCompact}
          />
        )}

        {role === "admin" && (
          <>
            <DesktopLink
              href="/inspection"
              icon={<SearchCheck />}
              label="Inspect"
              isCompact={isCompact}
            />
            <DesktopLink
              href="/category"
              icon={<BookCopy />}
              label="Code"
              isCompact={isCompact}
            />
            <DesktopLink
              href="/location"
              icon={<MapPin />}
              label="Zone"
              isCompact={isCompact}
            />
            <DesktopLink
              href="/user"
              icon={<User2 />}
              label="User"
              isCompact={isCompact}
            />
          </>
        )}

        <div className="flex flex-grow flex-col"></div>
        <div className="flex w-full items-center justify-center py-2">
          <Clock10Icon size={12}/>
                <p
        className="text-xs text-gray-600 text-left px-1 select-none"
        aria-label="Current date and time"
      >
        {dateTime}
      </p>
        </div>
      </div>
    </nav>
  );
}
