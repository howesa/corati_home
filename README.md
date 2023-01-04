# Corati: Computationally Rational Models of Human Cognition

This repo is a collection of resources for creating Python models of human cognition. The models brings together the idea of cognitive architectures from psychology with the theory of bounded optimality from machine learning. The resources may be useful to a number of communities:

* Cognitive scientists: learn how to model cognitive architectures and reward structures and solve the decision problem using RL (reinforcement learning). 
* AI researchers: learn how to use RL to model human cognition.
* HCI researchers: learn how to create generative models of user behavior.

**What is it?** The key idea in computational rationality is that human interactive behavior emerges as a consequence of a control policy that is optimally adapted to subjective preferences and to bounds, where the preferences include perceived gains and costs, among them the costs of time spent and errors, and the bounds are imposed by both an internal environment (the mind) and an external environment (including a device). Contrary to regular reinforcement learning models, in computational rationality the control policy that is adapted to these bounds interacts with the external environment not directly but only via its own internal, or cognitive, environment. The view is called “computational rationality” because the control policy used to predict interaction is the “rational” (or optimal) policy within the limits imposed by the computations available to the mind. The most up-to-date review is given in [a recent CHI paper](https://dl.acm.org/doi/abs/10.1145/3491102.3517739). 


## Models

* [Multi-attribute decision-making (A great tutorial)](models/multi_attribute_decision_making_desk)
* [Gaze-based interaction (Proc. CHI'21)](models/gaze_based_interaction)
* [Typing (Proc. CHI'21)](models/touchscreen-typing)
* [Task interleaving (Computational Brain and Behavior 2020)](https://github.com/christophgebhardt/task-interleaving)
* [Computationally rational biomechanical user models (Proc. UIST'22)](https://github.com/aikkala/user-in-the-box)

## Selected Bibliography (Aug 28, 2022)

### HCI APPLICATIONS

D. P. Brumby, D. D. Salvucci, and A. Howes. 2007. Dialing while driving? A bounded rational analysis of concurrent multi-task behavior. In Proceedings of the 8th International Conference on Cognitive Modeling. 121–126.

Xiuli Chen, Aditya Acharya, Antti Oulasvirta, and Andrew Howes. 2021. An adaptive model of gaze-based selection. In Proceedings of the 2021 CHI Conference on Human Factors in Computing Systems. 

Xiuli Chen, Gilles Bailly, Duncan P. Brumby, Antti Oulasvirta, and Andrew Howes. 2015. The emergence of interactive behaviour: A model of rational menu search. In Proceedings of the 33rd Annual ACM Conference on Human Factors in Computing Systems. ACM, 4217–4226.

Christoph Gebhardt, Antti Oulasvirta, and Otmar Hilliges. 2021. Hierarchical reinforcement learning explains task interleaving behavior. Computational Brain & Behavior 4 (2021), 284–304. 

Jussi P.P. Jokinen, Aditya Acharya, Mohammad Uzair, Xinhui Jiang, and Antti Oulasvirta. 2021. Touchscreen typing as optimal supervisory control. In Proceedings of the 2021 CHI Conference on Human Factors in Computing Systems

Jussi P. P. Jokinen and Tuomo Kujala. 2021. Modelling drivers’ adaptation to assistance systems. In 13th International Conference on Automotive User Interfaces and Interactive Vehicular Applications. 12–19.

Jussi P. P. Jokinen, Tuomo Kujala, and Antti Oulasvirta. 2020. Multitasking in driving as optimal adaptation under uncertainty. Human Factors (2020), 0018720820927687. 

Jussi P. P. Jokinen, Zhenxin Wang, Sayan Sarcar, Antti Oulasvirta, and Xiangshi Ren. 2020. Adaptive feature guidance: Modelling visual search with graphical layouts. International Journal of Human–Computer Studies 136 (2020), 102376. 

Katri Leino, Antti Oulasvirta, and Mikko Kurimo. 2019. RL-KLM: Automating keystroke-level modeling with reinforcement learning. In Proceedings of the 24th International Conference on Intelligent User Interfaces. 476–480. 

Sayan Sarcar, Jussi P. P. Jokinen, Antti Oulasvirta, Zhenxin Wang, Chaklam Silpasuwanchai, and Xiangshi Ren. 2018. Ability-based optimization of touchscreen interactions. IEEE Pervasive Computing 17, 1 (2018), 15–26. 

Kashyap Todi, Jussi Jokinen, Kris Luyten, and Antti Oulasvirta. 2018. Familiarisation: Restructuring layouts with visual learning models. In 23rd International Conference on Intelligent User Interfaces. 547–558.

Kashyap Todi, Jussi Jokinen, Kris Luyten, and Antti Oulasvirta. 2019. Individualising graphical layouts with predictive visual search models. ACM Transactions on Interactive Intelligent Systems (TiiS) 10, 1(2019), 1–24. 

### METHODS

Matthew Botvinick and Ari Weinstein. 2014. Model-based hierarchical reinforcement learning and human action control. Philosophical Transactions of the Royal Society B: Biological Sciences 369, 1655 (2014), 20130480.

Nathaniel D. Daw. 2014. Advanced reinforcement learning. Neuroeconomics (2014), 299–320. 

Jussi P. P. Jokinen, Ulpu Remes, Tuomo Kujala, and Jukka Corander. 2021. Bayesian parameter inference for cognitive simulators. In Bayesian methods for interaction design (forthcoming), Nikola Banovic, Per Ola Kirstensson, Antti Oulasvirta, and John H. Williamson (Eds.). Cambridge University Press. 

Antti Kangasrääsiö, Jussi P. P. Jokinen, Antti Oulasvirta, Andrew Howes, and Samuel Kaski. 2019. Parameter inference for computational cognitive models with Approximate Bayesian Computation. Cognitive Science 43, 6 (2019), e12738.

### THEORY

B. Bahrami, K. Olsen, P. E. Latham, A. Roepstorff, G. Rees, and C. D. Frith. 2010. Optimally interacting minds. Science 329, 5995 (2010), 1081–1085. 

Stuart Armstrong and Sören Mindermann. 2018. Occam's razor is insufficient to infer the preferences of irrational agents. In Advances in neural information processing systems. 5598–5609.

Richard Bellman. 1966. Dynamic programming. Science 153, 3731 (1966), 34–37. 

P. Dayan. 2014. Rationalizable irrationalities of choice. Topics in Cognitive Science(2014). 

Andrew Howes, Richard L Lewis, and Alonso Vera. 2009. Rational adaptation under task and processing constraints: Implications for testing theories of cognition and action.Psychological review 116, 4 (2009), 717. 

Keno Juechems, Jan Balaguer, Bernhard Spitzer, and Christopher Summerfield. 2021. Optimal utility and probability functions for agents with finite computational precision. Proceedings of the National Academy of Sciences 118, 2 (2021).

Richard L. Lewis, Andrew Howes, and Satinder Singh. 2014. Computational rationality: Linking mechanism and behavior through bounded utility maximization. Topics in Cognitive Science 6, 2 (2014), 279–311. 

Falk Lieder and Thomas L Griffiths. 2019. Resource-rational analysis: understanding human cognition as the optimal use of limited computational resources. Behavioral and Brain Sciences(2019), 1–85.

Oulasvirta, A., Jokinen, J. P., & Howes, A. (2022). Computational Rationality as a Theory of Interaction. In CHI Conference on Human Factors in Computing Systems (pp. 1-14).

S. J. Payne, A. Howes, and W. R. Reader. 2001. Adaptively distributing cognition: A decision-making perspective on human–computer interaction. Behaviour & Information Technology 20, 5 (2001), 339–346

P. Pirolli. 2007. Information foraging theory: Adaptive interaction with information. Vol. 2. Oxford University Press: USA.

Stuart J. Russell. 1997. Rationality and intelligence. Artificial Intelligence 94, 1–2 (1997), 57–77. 

Stuart J. Russell and Devika Subramanian. 1994. Provably bounded-optimal agents. Journal of Artificial Intelligence Research 2 (1994), 575–609. 

Satinder Singh, Richard L. Lewis, and Andrew G. Barto. 2009. Where do rewards come from?. In Proceedings of the 31st Annual Conference of the Cognitive Science Society. Cognitive Science Society, 2601–2606. 
