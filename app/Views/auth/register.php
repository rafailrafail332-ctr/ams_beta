<?= $this->extend('auth/templates/index'); ?>
<?= $this->section('content'); ?>

<div class="container">

  <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-6 col-md-6 d-flex flex-column align-items-center justify-content-center">

          <div class="d-flex justify-content-center py-4">
            <a href="<?= base_url(); ?>" class="logo d-flex align-items-center w-auto">
              <img src="<?= base_url(); ?>/assets/img/logo_gp.png" alt="">
              <span class="d-none d-lg-block"></span>
            </a>
          </div><!-- End Logo -->

          <div class="card mb-3">

            <div class="card-body">


              <div class="pt-4 pb-2">
                <h5 class="card-title text-center pb-0 fs-4"><?= lang('Auth.register') ?></h5>
                <p class="text-center small"><B>ASHOKA MANAGEMENT SYSTEM</B></p>
              </div>
              <?= view('Myth\Auth\Views\_message_block') ?>

              <form action="<?= url_to('register') ?>" method="post" class="user row g-3">
                <?= csrf_field() ?>
                <div class="col-12">
                  <label for="yourName" class="form-label">Nama Lengkap</label>
                  <input type="text" name="name" class="form-control <?php if (session('errors.nama_lengkap')) : ?>is-invalid<?php endif ?>" id="yourName">
                  <div class="invalid-feedback">Please, enter your name!</div>
                </div>

                <div class="col-12">
                  <label for="yourEmail" class="form-label">Email</label>
                  <input type="email" name="email" class="form-control <?php if (session('errors.email')) : ?>is-invalid<?php endif ?>" id="yourEmail" value="<?= old('email') ?>">
                  <div class="invalid-feedback">Please enter a valid Email adddress!</div>
                </div>

                <div class="col-12">
                  <label for="yourUsername" class="form-label">Username</label>
                  <div class="input-group has-validation">
                    <span class="input-group-text" id="inputGroupPrepend">@</span>
                    <input type="text" name="username" class="form-control <?php if (session('errors.username')) : ?>is-invalid<?php endif ?>" name="username"" id=" yourUsername" value="<?= old('username') ?>">
                    <div class="invalid-feedback">Please choose a username.</div>
                  </div>
                </div>

                <div class="col-12">
                  <label for="yourPassword" class="form-label">Password</label>
                  <input type="password" name="password" class="form-control form-control <?php if (session('errors.password')) : ?>is-invalid<?php endif ?>" id="yourPassword" autocomplete="off">
                  <div class="invalid-feedback">Please enter your password!</div>
                </div>

                <div class="col-12">
                  <button class="btn btn-primary w-100" type="submit"><?= lang('Auth.register') ?></button>
                </div>
                <div class="col-12">
                  <p class="small mb-0">Sudah Punya Akun? <a href="<?= url_to('login') ?>">Log in</a></p>
                </div>
              </form>

            </div>
          </div>

        </div>
      </div>
    </div>

  </section>

</div>

<?= $this->endSection(); ?>