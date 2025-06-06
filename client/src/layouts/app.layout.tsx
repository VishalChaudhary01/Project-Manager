import { Outlet } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

export const AppLayout = () => {
  return (
    <div className='flex min-h-screen w-full overflow-y-hidden'>
      <div className='flex flex-col w-full'>
        <ScrollArea className='flex-1 max-h-[calc(100vh-30px)]'>
          <main className='py-6 px-4 md:px-6 max-w-7xl mx-auto'>
            <Outlet />
          </main>
        </ScrollArea>
      </div>
    </div>
  );
};
