jake_hook :build_complete do |build|
  `flexsdk/bin/mxmlc -use-network=false -o build/dynamicaudio.swf -file-specs "source/dynamicaudio.as"`
  %w[README.md LICENSE demo.html].each do |f|
    FileUtils.cp f, build.build_directory
  end
end

jake_helper :version do
  `git rev-list HEAD | head -1 | cut -c-20`.strip
end

