{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/release-24.11";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs =
    inputs:
    inputs.flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [
        "aarch64-linux" # 64-bit ARM Linux
        "x86_64-linux" # 64-bit x86 Linux
        "aarch64-darwin" # 64-bit ARM macOS
        "x86_64-darwin" # 64-bit x86 macOS
      ];

      perSystem =
        {
          pkgs,
          ...
        }:
        {
          devShells = {
            default = pkgs.mkShell {
              buildInputs = with pkgs; [
                nodejs-slim_22
                corepack
                ffmpeg
              ];
            };
          };
        };
    };
}
