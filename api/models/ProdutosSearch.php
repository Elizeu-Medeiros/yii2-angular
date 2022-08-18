<?php

namespace app\models;

use yii\base\Model;
use yii\data\ActiveDataProvider;
use app\models\Produtos;
use yii\db\Query;

/**
 * ProdutosSearch represents the model behind the search form of `app\models\Produtos`.
 */
class ProdutosSearch extends Produtos
{
    public $q;
    public $page = 1;
    public $per_page = 20;
    public $in_roles = [];
    public $not_in_status = [];
    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['id', 'categoria_id', 'quantidade'], 'integer'],
            [['nome', 'create_at', 'update_at'], 'safe'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function scenarios()
    {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }

    /**
     * Creates data provider instance with search query applied
     *
     * @param array $params
     *
     * @return ActiveDataProvider
     */
    public function search($params)
    {
        $query = Produtos::find();

        // add conditions that should always apply here

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);

        $this->load($params);

        if (!$this->validate()) {
            // uncomment the following line if you do not want to return any records when validation fails
            // $query->where('0=1');
            return $dataProvider;
        }

        // grid filtering conditions
        $query->andFilterWhere([
            'id' => $this->id,
            'categoria_id' => $this->categoria_id,
            'quantidade' => $this->quantidade,
            'create_at' => $this->create_at,
            'update_at' => $this->update_at,
        ]);

        $query->andFilterWhere(['like', 'nome', $this->nome]);

        return $dataProvider;
    }

    public function getDataProvider()
    {
        $queryParams = [];
        $params = \Yii::$app->request->get();
        $this->q = (!empty($params['q'])) ? $params['q'] : "";
        $this->page = $params['page'];
        $this->per_page = $params['per_page'];

        $query = new Query();
        $query->from('produtos');
        $query->innerJoin('categorias', 'categorias.id = produtos.categoria_id')
            // $query->joinWith(['produtos p', 'categorias c']);
            ->select([
                'produtos.id',
                'produtos.nome',
                'produtos.quantidade',
                'produtos.categoria_id',
                'categorias.nome categoria',
                'produtos.create_at',
                'produtos.update_at'
            ]);

        if ($this->q) {
            $query->andWhere([
                'or',
                ['like', 'produtos.nome', $this->q],
                ['like', 'categorias.nome', $this->q],
            ]);
            $queryParams['q'] = $this->q;
        }

        $page = $this->page > 0 ? ($this->page - 1) : 0;
        $pageSize = (int)$this->per_page;

        $provider = new ActiveDataProvider([
            'query' => $query,
            'pagination' => [
                'forcePageParam' => true,
                'page' => $page,
                'pageParam' => 'page',
                'defaultPageSize' => $pageSize,
                'pageSizeLimit' => [1, 100],
                'pageSizeParam' => 'per_page',
                'validatePage' => true,
                'params' => $queryParams,
            ],
            // 'sort' => [
            //     'defaultOrder' => [
            //         'id' => SORT_DESC,
            //     ]
            // ]
        ]);

        $rows = $provider->getModels();
        $pagination = array_intersect_key(
            (array)$provider->pagination,
            array_flip(
                \Yii::$app->params['paginationParams']
            )
        );

        $pagination['firstRowNo'] = $pagination['totalCount'] - ($page * $pageSize);

        return [
            'rows' => $rows,
            'pagination' => $pagination,
        ];
    }
}
