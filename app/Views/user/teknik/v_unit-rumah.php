<?= $this->extend('user/templates/dashboard_user') ?>
<?= $this->section('content') ?>

<div class="row">
        <div class="col-lg-12">

          <div class="card">
            <div class="card-body">
              <h5 class="card-title"><?= $subtitle2; ?></h5>

              <!-- Table with stripped rows -->
              <table class="table datatable">
              <button type="button" class="btn btn-sm btn-primary"><i class="bi bi-plus"></i> Buat Baru</button>
                <thead>
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Position</th>
                    <th scope="col">Age</th>
                    <th scope="col">Start Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>Brandon Jacob</td>
                    <td>Designer</td>
                    <td>28</td>
                    <td>2016-05-25</td>
                  </tr>
                </tbody>
              </table>
              <!-- End Table with stripped rows -->

            </div>
          </div>

        </div>
      </div>
<?= $this->endSection() ?>