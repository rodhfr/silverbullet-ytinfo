ARG DENO_TAG
FROM denoland/deno:$DENO_TAG AS deno
FROM mcr.microsoft.com/devcontainers/typescript-node:20
COPY --from=deno /deno /usr/local/bin/deno

ENV DENO_INSTALL_ROOT=/usr/local
RUN sudo -E /usr/local/bin/deno install -f \
    --name silverbullet \
    --unstable-kv --unstable-worker-options --global \
    -A https://get.silverbullet.md
