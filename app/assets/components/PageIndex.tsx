import "../css/pageindex.css"

const PageIndex = ({
  currPage,
  pages,
}: {
  currPage: number;
  pages: number;
}) => {
  return (
    <div className="index-container">
      {Array.from({ length: pages }).map((_, i) => (
        <div className={`page ${currPage === i+1 ? "cindex" : ""}`}></div>
      ))}
    </div>
  );
};

export default PageIndex;
