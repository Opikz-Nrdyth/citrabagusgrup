import { Container } from "react-bootstrap";

const Maps = () => {
  return (
    <Container>
      <div data-aos="fade-up">
        <h1 className="title" id="Maps">
          Maps
        </h1>
        <p className="br-heart fs-6">
          <i className="fa-regular fa-heart"></i>
        </p>
      </div>
      <div className="mapouter" data-aos="zoom-in">
        <div className="gmap_canvas">
          <iframe
            width="100%"
            height="100%"
            title="maps"
            id="gmap_canvas"
            src="https://maps.google.com/maps?q=Citra Bagus Grup&t=&z=15&ie=UTF8&iwloc=&output=embed"
          ></iframe>
        </div>
      </div>
      <br />
      <br />
      <br />
    </Container>
  );
};
export default Maps;
