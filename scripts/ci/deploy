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

readonly commit_hash="${TRAVIS_COMMIT::12}"
readonly image_name="strattadb/bottlecap"
readonly image_tag="${commit_hash}"

build_docker_image() {
    docker build \
        --file Dockerfile \
        --tag "${image_name}:${image_tag}" \
        --tag "${image_name}:latest" \
        "${__root}"
}

log_in_to_docker() {
    echo "${DOCKER_PASSWORD}" | docker login \
        --username "${DOCKER_USERNAME}" \
        --password-stdin
}

push_docker_image() {
    docker push "${image_name}:${image_tag}"
}

main() {
    build_docker_image
    log_in_to_docker
    push_docker_image
}

main
