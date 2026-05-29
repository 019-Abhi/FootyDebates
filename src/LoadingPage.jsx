import "./LoadingPage.css";


function LoadingPage() {
    return(
        <div className="loading-page">
            <div className="loading-card" />
            <div classname="loading-grid" >
                <div className="skeleton-card" />
                <div className="skeleton-card" />
            </div>
            <div className="skeleton-card skeleton-card--tall" />

        </div>

    );
}
export default LoadingPage;
