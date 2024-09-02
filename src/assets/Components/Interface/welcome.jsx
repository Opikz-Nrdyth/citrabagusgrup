const Welcome = () => {
  return (
    <div id="home">
      <div className="bg-image-welcome z-n1"></div>
      <div className="gradation-black z-n1"></div>
      <svg className="position-absolute top-50 start-50 translate-middle citraBagusGrup">
        <text x="50%" y="50%" dy=".35em" textAnchor="middle">
          Citra Bagus Grup
        </text>
      </svg>
      <div
        className="position-absolute top-50 start-50 translate-middle langkahTepat w-100"
        align="center"
      >
        <h1 className="bounceInLeft text-white fw-bolder">
          Langkah Tepat <span className="text-info">Berprestasi</span>
        </h1>
      </div>
    </div>
  );
};
export default Welcome;
