import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface DrawAnimationProps {
    onComplete: () => void;
}

export const DrawAnimation: React.FC<DrawAnimationProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[400px] space-y-8"
        >
            <motion.div
                animate={{
                    rotate: 360,
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full"
            />

            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                    Simulating Draw...
                </h2>
                <p className="text-gray-400">
                    Calculating matchups with UEFA constraints
                </p>
            </div>

            <div className="w-full max-w-md">
                <div className="bg-white/10 rounded-full h-3 overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <p className="text-center text-sm text-gray-400 mt-2">{progress}%</p>
            </div>
        </motion.div>
    );
};
