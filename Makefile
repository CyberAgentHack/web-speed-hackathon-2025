#!/usr/bin/make -f
##
#SHELL=/bin/sh
#SHELL=/bin/bash
SHELL=/usr/bin/env bash
DIR:=$(realpath $(firstword $(MAKEFILE_LIST)))
BASE:=$(shell dirname ${DIR})
##
#define README
## README
#endef
#export README
_readme:
	@echo '--- Makefile Task List ---'
	@grep '^[^#[:space:]|_][a-z|_]*:' Makefile
gip: # global ip
	curl ifconfig.io
base: # base path
	@echo ${BASE}
kill:
	lsof -i :8000
	# ps -e | grep node | awk '{print $1}'
	# kill -9 [PID]
now:
	@date
setup:now
	corepack enable pnpm
	corepack use pnpm@latest
	pnpm install
db: now
	cd workspaces/server && pnpm database:reset && pnpm database:migrate
init:now
	curl -X POST http://localhost:8000/api/initialize
test:now
	date && pnpm test && date
dev:now
	pnpm run build
	pnpm run start
