# Check if the number of parameters is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <number_of_zip_files>"
    exit 1
fi

# Get the number of zip files from the first parameter
num_zip_files=$1

# Loop to process the specified number of zip files
for ((i=1; i<=num_zip_files-1; i++)); do
    zip_file="bk.z0${i}"
    echo "Processing $zip_file..."
    rm -r ${zip_file}
done
rm -r bk.zip
echo "Finished processing $num_zip_files zip files."