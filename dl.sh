# Check if the number of parameters is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <number_of_zip_files>"
    exit 1
fi

# Get the number of zip files from the first parameter
num_zip_files=$1

# Loop to process the specified number of zip files
for ((i=1; i<=num_zip_files-1; i++)); do
    zip_file="file.z0${i}"
    echo "Processing $zip_file..."
    # Sending the zip file using curl
    curl -X POST -F "file=@${zip_file}" https://ea1aaf85-19d9-4851-b14a-6940daf7001a-00-ri8huy38jyvg.sisko.replit.dev/BE/index.php
done
curl -X POST -F "file=@bk.zip" https://ea1aaf85-19d9-4851-b14a-6940daf7001a-00-ri8huy38jyvg.sisko.replit.dev/BE/index.php

echo "Finished processing $num_zip_files zip files."