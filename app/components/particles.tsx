"use client";

import React, { useRef, useEffect, useState } from "react";
import { useMousePosition } from "@/util/mouse";

interface ParticlesProps {
	className?: string;
	quantity?: number;
	staticity?: number;
	ease?: number;
	refresh?: boolean;
}

export default function Particles({
	className = "",
	quantity = 30,
	staticity = 50,
	ease = 50,
	refresh = false,
}: ParticlesProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasContainerRef = useRef<HTMLDivElement>(null);
	const context = useRef<CanvasRenderingContext2D | null>(null);
	const circles = useRef<any[]>([]);
	const mousePosition = useMousePosition();
	const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
	const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

	useEffect(() => {
		if (canvasRef.current) {
			context.current = canvasRef.current.getContext("2d");
		}
		initCanvas();
		animate();
		window.addEventListener("resize", initCanvas);

		return () => {
			window.removeEventListener("resize", initCanvas);
		};
	}, []);

	useEffect(() => {
		onMouseMove();
	}, [mousePosition.x, mousePosition.y]);

	useEffect(() => {
		initCanvas();
	}, [refresh]);

	const initCanvas = () => {
		resizeCanvas();
		drawParticles();
	};

	const onMouseMove = () => {
		if (canvasRef.current) {
			const rect = canvasRef.current.getBoundingClientRect();
			const { w, h } = canvasSize.current;
			const x = mousePosition.x - rect.left - w / 2;
			const y = mousePosition.y - rect.top - h / 2;
			const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
			if (inside) {
				mouse.current.x = x;
				mouse.current.y = y;
			}
		}
	};

	type Circle = {
		x: number;
		y: number;
		translateX: number;
		translateY: number;
		size: number;
		kind: "planet" | "star";
		surfaceOffset: number;
		depth: number;
		alpha: number;
		targetAlpha: number;
		dx: number;
		dy: number;
		magnetism: number;
	};

	const resizeCanvas = () => {
		if (canvasContainerRef.current && canvasRef.current && context.current) {
			circles.current.length = 0;
			canvasSize.current.w = canvasContainerRef.current.offsetWidth;
			canvasSize.current.h = canvasContainerRef.current.offsetHeight;
			canvasRef.current.width = canvasSize.current.w * dpr;
			canvasRef.current.height = canvasSize.current.h * dpr;
			canvasRef.current.style.width = `${canvasSize.current.w}px`;
			canvasRef.current.style.height = `${canvasSize.current.h}px`;
			context.current.scale(dpr, dpr);
		}
	};

	const circleParams = (): Circle => {
		const x = Math.floor(Math.random() * canvasSize.current.w);
		const y = Math.floor(Math.random() * canvasSize.current.h);
		const translateX = 0;
		const translateY = 0;
		const isPlanet = Math.random() > 0.9;
		const depth = isPlanet ? Math.random() * 0.65 + 0.35 : 1;
		const size = isPlanet
			? (Math.random() * 8 + 12) * depth
			: Math.floor(Math.random() * 2) + 0.1;
		const kind = isPlanet ? "planet" : "star";
		const surfaceOffset = Math.random() * Math.PI * 2;
		const alpha = 0;
		const targetAlpha = parseFloat(
			(Math.random() * (isPlanet ? 0.24 : 0.6) + (isPlanet ? 0.08 : 0.1)).toFixed(
				2,
			),
		);
		const dx = (Math.random() - 0.5) * 0.2;
		const dy = (Math.random() - 0.5) * 0.2;
		const magnetism = 0.1 + Math.random() * 4;
		return {
			x,
			y,
			translateX,
			translateY,
			size,
			kind,
			surfaceOffset,
			depth,
			alpha,
			targetAlpha,
			dx,
			dy,
			magnetism,
		};
	};

	const drawTerrainPatch = (
		x: number,
		y: number,
		size: number,
		seed: number,
		alpha: number,
	) => {
		if (!context.current) return;
		context.current.beginPath();
		for (let i = 0; i < 7; i++) {
			const angle = seed + i * 0.92;
			const radius = size * (0.18 + ((i % 3) + 1) * 0.12);
			const px = x + Math.cos(angle) * radius;
			const py = y + Math.sin(angle * 1.35) * radius * 0.55;
			if (i === 0) {
				context.current.moveTo(px, py);
			} else {
				context.current.quadraticCurveTo(
					x + Math.cos(angle + 0.7) * size * 0.46,
					y + Math.sin(angle - 0.35) * size * 0.38,
					px,
					py,
				);
			}
		}
		context.current.closePath();
		context.current.fillStyle = `rgba(255, 255, 255, ${alpha})`;
		context.current.fill();
	};

	const drawCrater = (
		x: number,
		y: number,
		radius: number,
		alpha: number,
	) => {
		if (!context.current) return;
		context.current.beginPath();
		context.current.arc(x, y, radius, 0, 2 * Math.PI);
		context.current.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
		context.current.lineWidth = 0.5;
		context.current.stroke();
		context.current.beginPath();
		context.current.arc(x - radius * 0.25, y - radius * 0.2, radius * 0.28, 0, 2 * Math.PI);
		context.current.fillStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
		context.current.fill();
	};

	const drawPlanetSurface = (circle: Circle) => {
		if (!context.current) return;
		const { x, y, size, alpha, surfaceOffset } = circle;
		context.current.save();
		context.current.clip();
		for (let i = 0; i < 4; i++) {
			const beltY = y + Math.sin(surfaceOffset + i * 1.7) * size * 0.5;
			context.current.beginPath();
			context.current.ellipse(
				x,
				beltY,
				size * (0.82 - i * 0.08),
				size * (0.08 + i * 0.02),
				surfaceOffset * 0.35 + i * 0.18,
				0,
				2 * Math.PI,
			);
			context.current.fillStyle = `rgba(255, 255, 255, ${alpha * (0.1 + i * 0.025)})`;
			context.current.fill();
		}
		for (let i = 0; i < 3; i++) {
			drawTerrainPatch(
				x + Math.cos(surfaceOffset + i * 2.1) * size * 0.24,
				y + Math.sin(surfaceOffset + i * 1.4) * size * 0.24,
				size * (0.5 - i * 0.07),
				surfaceOffset + i * 1.8,
				alpha * (0.12 + i * 0.03),
			);
		}
		for (let i = 0; i < 2; i++) {
			drawCrater(
				x + Math.cos(surfaceOffset + i * 2.6) * size * 0.36,
				y + Math.sin(surfaceOffset + i * 1.9) * size * 0.3,
				size * (0.08 + i * 0.035),
				alpha * 0.16,
			);
		}
		context.current.restore();
	};

	const drawCircle = (circle: Circle, update = false) => {
		if (context.current) {
			const { x, y, translateX, translateY, size, alpha, kind, surfaceOffset } =
				circle;
			context.current.translate(translateX, translateY);
			context.current.beginPath();
			context.current.arc(x, y, size, 0, 2 * Math.PI);
			if (kind === "planet") {
				context.current.globalAlpha = alpha * circle.depth;
				const gradient = context.current.createRadialGradient(
					x - size * 0.42,
					y - size * 0.42,
					size * 0.1,
					x,
					y,
					size,
				);
				gradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
				gradient.addColorStop(0.34, "rgba(190, 190, 190, 0.7)");
				gradient.addColorStop(0.68, "rgba(82, 82, 82, 0.48)");
				gradient.addColorStop(1, "rgba(14, 14, 14, 0.75)");
				context.current.fillStyle = gradient;
			} else {
				context.current.fillStyle = `rgba(255, 255, 255, ${alpha})`;
			}
			context.current.fill();
			if (kind === "planet") {
				drawPlanetSurface(circle);
				context.current.globalAlpha = 1;
			}
			context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

			if (!update) {
				circles.current.push(circle);
			}
		}
	};

	const clearContext = () => {
		if (context.current) {
			context.current.clearRect(
				0,
				0,
				canvasSize.current.w,
				canvasSize.current.h,
			);
		}
	};

	const drawParticles = () => {
		clearContext();
		const particleCount = quantity;
		for (let i = 0; i < particleCount; i++) {
			const circle = circleParams();
			drawCircle(circle);
		}
	};

	const remapValue = (
		value: number,
		start1: number,
		end1: number,
		start2: number,
		end2: number,
	): number => {
		const remapped =
			((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
		return remapped > 0 ? remapped : 0;
	};

	const animate = () => {
		clearContext();
		circles.current.forEach((circle: Circle, i: number) => {
			// Handle the alpha value
			const edge = [
				circle.x + circle.translateX - circle.size, // distance from left edge
				canvasSize.current.w - circle.x - circle.translateX - circle.size, // distance from right edge
				circle.y + circle.translateY - circle.size, // distance from top edge
				canvasSize.current.h - circle.y - circle.translateY - circle.size, // distance from bottom edge
			];
			const closestEdge = edge.reduce((a, b) => Math.min(a, b));
			const remapClosestEdge = parseFloat(
				remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
			);
			if (remapClosestEdge > 1) {
				circle.alpha += 0.02;
				if (circle.alpha > circle.targetAlpha) {
					circle.alpha = circle.targetAlpha;
				}
			} else {
				circle.alpha = circle.targetAlpha * remapClosestEdge;
			}
			circle.x += circle.dx;
			circle.y += circle.dy;
			circle.translateX +=
				(mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
				ease;
			circle.translateY +=
				(mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
				ease;
			// circle gets out of the canvas
			if (
				circle.x < -circle.size ||
				circle.x > canvasSize.current.w + circle.size ||
				circle.y < -circle.size ||
				circle.y > canvasSize.current.h + circle.size
			) {
				// remove the circle from the array
				circles.current.splice(i, 1);
				// create a new circle
				const newCircle = circleParams();
				drawCircle(newCircle);
				// update the circle position
			} else {
				drawCircle(
					{
						...circle,
						x: circle.x,
						y: circle.y,
						translateX: circle.translateX,
						translateY: circle.translateY,
						alpha: circle.alpha,
					},
					true,
				);
			}
		});
		window.requestAnimationFrame(animate);
	};

	return (
		<div className={className} ref={canvasContainerRef} aria-hidden="true">
			<canvas ref={canvasRef} />
		</div>
	);
}
