.PHONY: install deploy test nightly

install:
scripts/install.sh

deploy:
scripts/deploy.sh

test:
scripts/test.sh

nightly:
scripts/nightly.sh
