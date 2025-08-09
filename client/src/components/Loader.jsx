function Loader(){
    return (
        <div className="flex justify-center items-center h-[100vh]">
        <div className="relative flex flex-col items-center gap-2">
            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent border-b-transparent rounded-full animate-spin"></div>
            <div className="h-full flex justify-center items-center text-2xl text-gray-400 animate-pulse">
            Loading...
            </div>
        </div>
        </div>
    );
}

export default Loader;