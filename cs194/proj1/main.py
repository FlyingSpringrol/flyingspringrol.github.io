# CS194-26 (CS294-26): Project 1 starter Python code

# these are just some suggested libraries
# instead of scikit-image you could use matplotlib and opencv to read, write, and display images

import numpy as np
from numpy import linalg as LA
import skimage as sk
from skimage import transform
from scipy import signal
import skimage.io as skio
from math import inf


def edge_detect(image):
	sobel_x = np.array(
		[1.0, 0.0, -1.0,
		 2.0, 0.0, -2.0,
		 1.0, 0.0, -1.0],
	)
	sobel_x = np.reshape(sobel_x, (3,3))
	sobel_x = sobel_x / 8.0

	sobel_y = np.array([
		 1.0, 2.0, 1.0,
		 0.0, 0.0, 0.0,
		-1.0, -2.0, -1.0
	])

	sobel_y = np.reshape(sobel_y, (3,3))
	sobel_y = sobel_y / 8.0

	orig = image[::]
	x_grad = signal.convolve2d(image, sobel_x, mode='same')
	y_grad = signal.convolve2d(image, sobel_y, mode='same')

	grad = np.sqrt(np.multiply(x_grad, x_grad) + np.multiply(y_grad, y_grad))

	return np.multiply(orig,grad)

def shift_image(image, x_shift, y_shift):
	shifted = image[::]
	shifted = np.roll(image, x_shift, axis=1)
	shifted = np.roll(shifted, y_shift, axis=0)
	return shifted

def align_window(static, move, shift_dist):
	#static is the umoving image
	x_dist = shift_dist #shift dist
	y_dist = shift_dist
	original_move = move[::]
	scores = dict()
	#also define window sizes, ignore the sides
	width = np.shape(static)[0]
	height = np.shape(static)[1]
	window_x = int(width / 3) #align based on inner 3rd box
	window_y = int(height / 3)
	window_width = int(width / 3)
	window_height = int(height / 3)

	rel = static[window_x:(window_x+window_width), window_y:(window_y+window_height)] #only look at center of image

	for x_shift in np.arange(-x_dist, x_dist):
		for y_shift in np.arange(-y_dist, y_dist):
			shift = (x_shift, y_shift)
			shifted = move[window_x:(window_x+window_width), window_y:(window_y+window_height)] #save shifted
			shifted = shift_image(shifted, x_shift, y_shift)
			#using normalized cross correlation
			'''
			norm_rel= rel / LA.norm(rel)
			norm_shifted = shifted / LA.norm(shifted)
			score = np.multiply(norm_rel, norm_shifted).sum()
			scores[shift] = score
			'''
			#using ssd
			score = np.multiply(rel - shifted, rel -shifted).sum()
			scores[shift] = score


	#find max score? Why maximize the distance between shifted vectors? something about intensity?
	min_score = inf
	score_key = (0, 0)
	for key in scores:
		if scores[key] < min_score:
			min_score = scores[key]
			score_key = key

	return score_key #return tuple



def align_pyramid(r, g, b):
	shift = 15
	g_shifts = (0,0)
	b_shifts = (0,0)
	ar = r[::]
	ag = g[::]
	ab = b[::]

	#small hack to calculate the levels of the pyramid
	targetSmall = 300
	width = np.shape(r)[0]
	height = np.shape(r)[1]
	factor = int(min(width, height) / targetSmall)

	g_x_shift = 0
	g_y_shift = 0
	b_x_shift = 0
	b_y_shift = 0

	for i in reversed(range(0,factor)):
		scale_factor = 1.0 / (i+1)
		ir = sk.transform.rescale(ar, (scale_factor, scale_factor)) #scale down image
		ig = sk.transform.rescale(ag, (scale_factor, scale_factor))
		ib = sk.transform.rescale(ab, (scale_factor, scale_factor))

		ir = edge_detect(ir)
		ib = edge_detect(ib)
		ig = edge_detect(ig)

		g_shifts = align_window(ir, ig, shift)
		b_shifts = align_window(ir, ib, shift)


		ag = shift_image(ag, g_shifts[0], g_shifts[1]) #shift image, as is iterative algorithm
		ab = shift_image(ab, b_shifts[0], b_shifts[1])

		g_x_shift += 1.0 / scale_factor * g_shifts[0]
		g_y_shift += 1.0 / scale_factor * g_shifts[1]
		b_x_shift += 1.0 / scale_factor * b_shifts[0]
		b_y_shift += 1.0 / scale_factor * b_shifts[1]
		

	print("G: (" + str(g_x_shift) + "," + str(g_y_shift) + ")" + " B: (" + str(b_x_shift) + "," + str(b_y_shift) + ")")

	im_out = np.dstack([ar, ag, ab])

	return im_out


# name of the input file
imname = './images/river.tif'

# read in the image
im = skio.imread(imname)

# convert to double (might want to do this later on to save memory)    
im = sk.img_as_float(im)
    
# compute the height of each part (just 1/3 of total)
height = np.floor(im.shape[0] / 3.0).astype(np.int)

# separate color channels
b = im[:height]
g = im[height: 2*height]
r = im[2*height: 3*height]

# align the images
# functions that might be useful for aligning the images include:
# np.roll, np.sum, sk.transform.rescale (for multiscale)

# create a color image
im_out = align_pyramid(r, g, b)

# save the image
fname = './outputs/river_all.jpg'
skio.imsave(fname, im_out)

# display the image
skio.imshow(im_out)
skio.show()
