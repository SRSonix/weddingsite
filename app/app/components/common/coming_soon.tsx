

export function ComingSoon({children}: {children: React.ReactNode}){
    return (
        <div className="m-4">
            <h3>Coming Soon!</h3>
            <p>this page is still under construction. Once it is available, you will be able to see</p>
            <div className="mt-4">
                {children}
            </div>
        </div>
    );
}