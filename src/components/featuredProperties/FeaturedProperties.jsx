import useFetch from "../../hooks/useFetch";
import "./featuredProperties.css";

const FeaturedProperties = () => {
  const { data, loading, error } = useFetch("/hotels?featured=true&limit=5");

  return (
    <div className="fp">
      {loading ? (
        "Loading please wait..."
      ) : (
        <>
        </>
      )}
    </div>
  );
};

export default FeaturedProperties;
