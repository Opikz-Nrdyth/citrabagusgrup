import "../../assets/Style/error_404.css";
const Eroor_404 = () => {
  return (
    <section className="page_404">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 ">
            <div className="col-sm-10 col-sm-offset-1  text-center">
              <div className="four_zero_four_bg">
                <h1 className="text-center ">404</h1>
              </div>

              <div className="contant_box_404">
                <h3 className="h2">Sepertinya Anda tersesat</h3>

                <p>
                  halaman yang Anda cari tidak tersedia atau sedang perbaikan!
                </p>

                <a
                  onClick={() => {
                    history.back();
                  }}
                  className="link_404"
                >
                  Kembali
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Eroor_404;
