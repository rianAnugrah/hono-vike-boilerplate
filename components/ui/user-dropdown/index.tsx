import { User2, ShieldCheck, ChevronsDownUpIcon, ChevronsUpDownIcon, EllipsisIcon, ShieldUserIcon } from "lucide-react";
import { useUserStore } from "@/stores/store-user-login";
import GlassButton from "../glass-button/glass-button";

export default function UserDropDown() {
  const {  name, role } = useUserStore();

  return (
    <div className=" cursor-pointer h-full w-full">
      <div
        tabIndex={0}
        role="button"
        className="flex flex-row gap-2 items-center justify-start py-4 rounded-lg w-full px-0"
      >
        <div className="bg-slate-200 w-12 h-12 rounded-full p-2 flex items-center justify-center overflow-hidden">
          {name ? (
            <div className="flex items-center justify-center text-slate-400 text-lg font-bold w-full h-full">
              {name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <User2 className="text-white w-full h-full" />
          )}
        </div>

        <div className="flex flex-col gap-[2px] items-start text-center flex-grow ">
          <p className="text-gray-700 text-left text-sm truncate w-full  ">
            {name}
          </p>
          <div className="text-[10px] flex items-center justify-center">
            <div className="flex rounded-full bg-green-200 items-center text-green-800 py-[2px] px-2 gap-1">
            <ShieldUserIcon size={12}/>
              <span className="truncate">
                {role === 'admin' ? 'Admin' : role === 'pic' ? 'PIC' : role === 'read_only' ? 'Read only' : role}
              </span>
            </div>
          </div>
        </div>
          <GlassButton size="sm">
            <EllipsisIcon size={14} />
          </GlassButton>
      </div>
    </div>
  );
}
