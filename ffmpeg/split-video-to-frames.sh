# takes a video and splits it into frames at a specified interval
# example usage:
#
# sh ./split-video-to-frames.sh input-file.mov 1 00:00:10 output-file-prefix

INPUT_FILENAME=$1
FRAMERATE=$2
START_TIME=$3
OUTPUT_PREFIX=$4
echo ""
echo "#####  #####    #####  #####    #####  #####    #####  #####    #####  #####"
echo "#      #   #    #      #   #    #      #   #    #      #   #    #      #   #"
echo "#  ##  #   #    #  ##  #   #    #  ##  #   #    #  ##  #   #    #  ##  #   #"
echo "#   #  #   #    #   #  #   #    #   #  #   #    #   #  #   #    #   #  #   #"
echo "#####  #####    #####  #####    #####  #####    #####  #####    #####  ##### "
echo ""
echo "############################################################################"
echo ""
echo "Splitting video ('$INPUT_FILENAME') starting at: '$START_TIME', at this rate: '$FRAMERATE', prefixing output with '$OUTPUT_PREFIX'"
echo ""
echo "############################################################################"
echo ""


###### #start time offset#input file          #same qual#framerate       #output file
ffmpeg -i "$INPUT_FILENAME" -qscale 0 -r "$FRAMERATE" -ss "$START_TIME" "$OUTPUT_PREFIX"-%03d.png