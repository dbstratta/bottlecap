#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset
[[ "${DEBUG:-false}" == "true" ]] && set -o xtrace

readonly __script_path="${BASH_SOURCE[0]}"
readonly __dir="$(cd "$(dirname "${__script_path}")" && pwd)"
readonly __file="${__dir}/$(basename "${__script_path}")"
readonly __base="$(basename "${__file}")"
readonly __root="$(cd "$(dirname "$(dirname "${__dir}")")" && pwd)"

readonly image_name="bottlecap_test"

build_docker_image() {
    docker build --file dev.dockerfile \
         --tag "${image_name}" \
         "${__root}"
}


run_tests() {
    docker run \
        --rm \
        --env CODECOV_TOKEN \
        --env CI \
        --env TRAVIS \
        --env TRAVIS_COMMIT \
        --env TRAVIS_JOB_NUMBER \
        --env TRAVIS_BRANCH \
        --env TRAVIS_JOB_ID \
        --env TRAVIS_PULL_REQUEST \
        --env TRAVIS_REPO_SLUG \
        --env TRAVIS_BUILD_DIR \
        "${image_name}" yarn test:ci
}

main() {
    build_docker_image
    run_tests
}

main
