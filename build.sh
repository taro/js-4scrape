#!/bin/sh
for f in ui/*.ui ; do
	ff=`echo $f | sed -e "s#ui/##" -e "s#.ui##"`
	cat ui/index.head ui/$ff.ui ui/index.middle js/$ff.js ui/index.bottom > $ff
done
