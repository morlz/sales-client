<template>
	<div></div>
</template>
<script>
import 'element-ui/lib/theme-chalk/index.css'
export default {}
</script>
<style lang="less">

@import url("../lib/FontAwesome/less/font-awesome.less");
@import url("https://fonts.googleapis.com/css?family=Roboto");

*::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.2);
    border-radius: 10px;
    background-color: #F5F5F5;
}

*::-webkit-scrollbar {
    width: 12px;
	height: 12px;
    background-color: #F5F5F5;
}

*::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.2);
    //background-color: rgba(60,141,188, 0.8);
    background-color: rgba(2,123,227, 0.8);
}

html {
    height: 100%;
	box-sizing: border-box;
}

body {
    margin: 0;
    height: 100%;
    color: #5a5e66;
	font-family: 'Roboto', serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

body.with-layout-side-opened {
	overflow: auto;
}

.fade {
	&-enter {
		opacity: 0;
		&-active {
			transition-property: opacity;
			transition-duration: 0.3s;
			transition-delay: 0.3s;
		}
		&-to {}
	}

	&-leave {
		&-active {}
		&-to {
			opacity: 0;
		}
	}
}

.fadeZoom {
	&-enter {
		opacity: 0;
		&-active {
			transition: all 0.7s ease-in-out;
		}
		&-to {}
	}

	&-leave {
		&-active {
			transition: all 0.7s ease-in-out;
		}
		&-to {
			opacity: 0;
		}
	}
}

.el {
	&-loading-mask {
		z-index: 1000;
	}

	&-tabs {
		&__item {
	        transition: all 0.3s ease-in-out;
	    }
	}

	&-dialog {
	    min-width: 400px;
	}

	&-card {
	    color: #5a5e66;
	    display: grid;
	    grid-template-rows: min-content auto;

	    &__body {
	        display: grid;
	        grid-auto-flow: row;
			.buttons {
				align-self: end;
			}
	    }
	}

	&-button,
	&-checkbox {
	    transition: all 0.3s ease-in-out;
	    span {
	        transition: all 0.3s ease-in-out;
	    }
	}

	&-popover-empty {
		padding: 0;
		box-shadow: 0;
	}
}
//

.q {
	&-item {
		transition: all .3s ease-in-out;
		&:hover {
			background: #ecf5ff;
		}
		&-side {
			&:nth-child(3) {
				font-weight: bold;
				text-align: right;
			}
		}
	}
	&-list {
		&-highlight {
			.q-item {
				&:hover {
					background: #ecf5ff;
				}
			}
		}
	}
}

.breadcrumb {
	a {
		transition: all 0.3s ease-in-out;
		&:after, &:before {
			transition: all 0.3s ease-in-out;
		}
	}
}

.layout {
	height: 100%;
	&-page {
		height: 100%;
		&-container {
			height: 100%;
		}
	}
}

.qCards {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
}

@media screen and (max-width: 650px) {
	.qCards {
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	}
}

.mainWrapper {
    height: 100%;
	width: 100%;
    .bc {
        height: 40px;
        line-height: 40px;
        white-space: nowrap;
        display: grid;
        grid-auto-flow: column;
        justify-content: flex-start;
        .el-breadcrumb__item {
            float: none;
        }
    }
}

h2 {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
}


.spinner {
    height: 50px;
}

.infoGrid {
	align-self: start;
	display: grid;
	grid-template-columns: 1fr 1fr;
	> div {
		padding: 15px 0;
		&:not(.lc) {
			border-bottom: 1px solid #f4f4f4;
		}
		&:nth-child(2n+1) {
			font-weight: bold;
		}
	}
}

.separator {
	&-v {
		background: #e0e0e0;
		width: 1px;
		height: 100%;
	}
	&-g {
		background: #e0e0e0;
		width: 100%;
		height: 1px;
	}
}
</style>
