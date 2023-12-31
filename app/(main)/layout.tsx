import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import Loading from "@/components/loading";
import { Suspense } from "react";

const MainLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <div className="h-full">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] h-full">
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </main>
      
    </div>
   );
}
 
export default MainLayout;