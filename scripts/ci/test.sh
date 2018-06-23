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
    local -r codecov_docker_env_variables="$(bash <(curl -s https://codecov.io/env))"

    docker run \
        --rm \
        --env CI \
        --env TRAVIS \
        "${codecov_docker_env_variables}" \
        "${image_name}" yarn test:ci
}

main() {
    build_docker_image
    run_tests
}

main
