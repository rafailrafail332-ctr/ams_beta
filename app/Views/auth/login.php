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
                <h5 class="card-title text-center pb-0 fs-4">LOGIN</h5>
                <p class="text-center small"><B>ASHOKA MANAGEMENT SYSTEM</B></p>
              </div>

              <?= view('Myth\Auth\Views\_message_block') ?>

              <form action="<?= url_to('login') ?>" method="post" class="row g-3">
                <?= csrf_field() ?>

                <?php if ($config->validFields === ['email']) : ?>
                  <div class="form-group">
                    <label for="login"><?= lang('Auth.email') ?></label>
                    <input type="email" class="form-control <?php if (session('errors.login')) : ?>is-invalid<?php endif ?>" name="login">
                    <div class="invalid-feedback">
                      <?= session('errors.login') ?>
                    </div>
                  </div>
                <?php else : ?>
                  <div class="form-group">
                    <label for="login"><?= lang('Auth.emailOrUsername') ?></label>
                    <input type="text" class="form-control <?php if (session('errors.login')) : ?>is-invalid<?php endif ?>" name="login">
                    <div class="invalid-feedback">
                      <?= session('errors.login') ?>
                    </div>
                  </div>
                <?php endif; ?>

                <div class="col-12">
                  <label for="yourPassword" class="form-label">Password</label>
                  <input type="password" name="password" class="form-control <?php if (session('errors.password')) : ?>is-invalid<?php endif ?>" id="yourPassword" required>
                  <div class="invalid-feedback">
                    <?= session('errors.password') ?>
                  </div>
                </div>

                <?php if ($config->allowRemembering) : ?>
                  <div class="col-12">
                    <div class="form-check">
                      <label class="form-check-label">
                        <input type="checkbox" name="remember" class="form-check-input" <?php if (old('remember')) : ?> checked <?php endif ?> id="rememberMe">
                        <?= lang('Auth.rememberMe') ?>
                      </label>
                    </div>
                  <?php endif; ?>

                  <div class="col-12">
                    <button class="btn btn-primary w-100" type="submit"><?= lang('Auth.loginAction') ?></button>
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